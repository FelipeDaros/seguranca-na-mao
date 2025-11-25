import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

async function scheduleNotification(minutos: number) {
  try {
    const { granted } = await Notifications.getPermissionsAsync();

    if (!granted) {
      const { granted } = await Notifications.requestPermissionsAsync();

      if (!granted) {
        Alert.alert('Notificações', 'Você não deu as permissões necessárias para emitir as notificações');
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'SEGURANÇA NA MAO - Alerta vigia!',
        priority: Notifications.AndroidNotificationPriority.MAX,
        body: 'Você precisa emitir o alerta vigia!',
        categoryIdentifier: 'alerta',
      },
      trigger: {
        seconds: minutos * 60
      },
      identifier: 'alerta'
    });
  } catch (error) {
    throw error
  }
}

async function scheduleNotificationGerarRondas() {
  const { granted } = await Notifications.getPermissionsAsync();

  if (!granted) {
    const { granted } = await Notifications.requestPermissionsAsync();

    if (!granted) {
      Alert.alert('Notificações', 'Você não deu as permissões necessárias para emitir as notificações');
      return;
    }
  }

  await Notifications.scheduleNotificationAsync({
    identifier: 'rondas',
    content: {
      title: 'SEGURANÇA NA MAO - Rondas',
      priority: Notifications.AndroidNotificationPriority.MAX,
      body: 'Você precisa gerar suas rondas!',
      categoryIdentifier: 'rondas',
      // sound: 'notification-sound.wav',
      // vibrate: [0, 250, 250, 250]
    },
    trigger: {
      seconds: 10,
      channelId: 'rondas'
    }
  });
}

export { scheduleNotification, scheduleNotificationGerarRondas }        