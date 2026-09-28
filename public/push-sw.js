self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'Facilitei', body: event.data ? event.data.text() : 'Você tem uma novidade.' };
  }

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const focusedWindow = windows.find((client) => client.visibilityState === 'visible');
    if (focusedWindow) {
      focusedWindow.postMessage({ type: 'FACILITEI_PUSH_RECEIVED', payload });
      return;
    }

    await self.registration.showNotification(payload.title || 'Facilitei', {
      body: payload.body || 'Você tem uma novidade.',
      icon: payload.icon || '/pwa-192x192.png',
      badge: payload.badge || '/pwa-64x64.png',
      tag: payload.tag || 'facilitei-notification',
      renotify: true,
      data: payload.data || { url: '/painel' },
      vibrate: [120, 60, 120],
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/painel', self.location.origin).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        await client.focus();
        if ('navigate' in client) await client.navigate(targetUrl);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(targetUrl);
  })());
});
