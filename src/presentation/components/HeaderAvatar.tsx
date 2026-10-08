import React, {
  useCallback,
  useState,
} from 'react';

import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import { getAvatarUri } from '../../data/storage/appStorage';

import Avatar from './Avatar';

export default function HeaderAvatar() {
  const router = useRouter();

  const [avatarUri, setAvatarUri] =
    useState<string | null>(null);

  const cargarAvatar = useCallback(
    async () => {
      try {
        const avatar =
          await getAvatarUri();

        setAvatarUri(avatar);
      } catch (error) {
        console.error(
          'Error cargando avatar del header:',
          error,
        );
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      cargarAvatar();
    }, [cargarAvatar]),
  );

  return (
    <TouchableOpacity
      onPress={() =>
        router.push('/(tabs)/perfil')
      }
      activeOpacity={0.8}
      style={styles.contenedor}
    >
      <Avatar
        uri={avatarUri}
        size={36}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginLeft: 12,
    marginRight: 4,
  },
});