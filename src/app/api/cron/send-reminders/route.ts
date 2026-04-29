import { createClient } from '@supabase/supabase-js';
import { sendReminderEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use service role or admin client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all anniversaries with user emails
    const { data: anniversaries, error } = await supabase
      .from('anniversaries')
      .select(`
        id,
        title,
        category,
        date,
        remind_offset,
        user_id,
        profiles!inner(email)
      `);

    if (error) {
      console.error('Error fetching anniversaries:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const anniversary of anniversaries || []) {
      const annDate = new Date(anniversary.date);
      const targetMonth = annDate.getMonth();
      const targetDay = annDate.getDate();

      // Calculate the actual anniversary date this year
      let nextOccurrence = new Date(today.getFullYear(), targetMonth, targetDay);
      if (nextOccurrence < today) {
        nextOccurrence = new Date(today.getFullYear() + 1, targetMonth, targetDay);
      }

      // Calculate days until the anniversary
      const daysUntil = Math.ceil(
        (nextOccurrence.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if today matches the remind_offset
      if (daysUntil === anniversary.remind_offset) {
        const profile = anniversary.profiles as unknown as { email: string };
        const email = profile?.email;

        if (!email) continue;

        try {
          const dateStr = `${targetMonth + 1}月${targetDay}日`;
          await sendReminderEmail({
            to: email,
            title: anniversary.title,
            category: anniversary.category as 'birthday' | 'anniversary',
            daysUntil: anniversary.remind_offset,
            date: dateStr,
          });
          sentCount++;
        } catch (err) {
          const errMsg = `Failed to send to ${email} for "${anniversary.title}": ${err}`;
          console.error(errMsg);
          errors.push(errMsg);
        }
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: anniversaries?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
