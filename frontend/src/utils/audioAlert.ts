// Web Audio Synthesizer for high-reliability order chime ringtone
export function playOrderRingtone() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Melodic cash register / victory alert chime sequence (C5 -> E5 -> G5 -> C6 -> E6)
    const chimeNotes = [
      { freq: 523.25, time: 0.0, dur: 0.12 },
      { freq: 659.25, time: 0.12, dur: 0.12 },
      { freq: 783.99, time: 0.24, dur: 0.14 },
      { freq: 1046.50, time: 0.38, dur: 0.35 },
      { freq: 1318.51, time: 0.65, dur: 0.60 }
    ];

    chimeNotes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur);
    });
  } catch (err) {
    console.warn('Unable to play audio ringtone:', err);
  }
}

// Phone vibration alert (if accessed on mobile device)
export function vibratePhone() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    // Ring pattern: ring (400ms), pause (150ms), ring (400ms), pause (150ms), long ring (700ms)
    try {
      navigator.vibrate([400, 150, 400, 150, 700]);
    } catch {}
  }
}

// Native Desktop & Mobile Browser System Notification
export function sendBrowserPushNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.svg',
          tag: 'memon-order-alert',
          silent: false
        });
      } catch {}
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.svg'
          });
        }
      });
    }
  }
}

// Complete Order Alert (Laptop Ringtone + Phone Vibration + System Notification + Webhook)
export function notifyNewOrder(order: {
  id: string;
  customerName: string;
  total: number;
  city: string;
  items: any[];
}) {
  // 1. Play loud chime ringtone on laptop / phone
  playOrderRingtone();

  // 2. Vibrate phone
  vibratePhone();

  // 3. Show native browser popup on laptop
  sendBrowserPushNotification(
    `🔔 New Order Received: Rs. ${order.total.toLocaleString()}`,
    `Order #${order.id} from ${order.customerName} (${order.city}) • ${order.items.length} item(s)`
  );

  // 4. Dispatch in-app event for admin dashboard audio & visual banner
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('memon_order_placed', { detail: order })
    );
  }

  // 5. Send order notification to backend for optional WhatsApp / Telegram phone message
  try {
    const adminPhone = localStorage.getItem('memon_admin_phone') || '';
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order,
        adminPhone
      })
    }).catch(() => {
      // Graceful offline fallback
    });
  } catch {}
}
