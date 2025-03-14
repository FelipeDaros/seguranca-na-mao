import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { IConfiguracoes } from '../interfaces/IUsuario';

async function scheduleNotification(configuracao: IConfiguracoes | undefined) {
  try {
    let valor;

    const { granted } = await Notifications.getPermissionsAsync();

    if (!granted) {
      const { granted } = await Notifications.requestPermissionsAsync();

      if (!granted) {
        Alert.alert('Notificações', 'Você não deu as permissões necessárias para emitir as notificações');
        return;
      }
    }

    if (!configuracao) {
      return;
    }

    switch (configuracao.parametro) {
      case 'seconds':
        valor = Number(configuracao.valor);
        break
      case 'minutes':
        valor = Number(configuracao.valor) * 60;
        break
      case 'hours':
        valor = Number(configuracao.valor) * 3600;
        break
      default:
        valor = Number(configuracao.valor) * 86400;
        break
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'SEGURANÇA NA MAO - Alerta vigia!',
        priority: Notifications.AndroidNotificationPriority.MAX,
        body: 'Você precisa emitir o alerta vigia!',
        categoryIdentifier: 'alerta',
        // sound: 'notification-sound.wav'
      },
      trigger: {
        seconds: valor
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