import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import {
  changePassword,
  getLocalEmail,
  validatePassword,
} from '../../../data/storage/authStorage';

import {
  clearSession,
  getAvatarUri,
  removeAvatar,
  saveAvatarUri,
} from '../../../data/storage/appStorage';

export function usePerfilViewModel() {
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    null,
  );

  const [passwordActual, setPasswordActual] =
    useState('');

  const [nuevaPassword, setNuevaPassword] =
    useState('');

  const [confirmarPassword, setConfirmarPassword] =
    useState('');

  /**
   * ==============================
   * CARGAR PERFIL
   * ==============================
   */

  const cargarPerfil = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const emailGuardado = await getLocalEmail();
      const avatarGuardado = await getAvatarUri();

      setEmail(emailGuardado ?? '');
      setAvatarUri(avatarGuardado);
    } catch (e) {
      console.error(
        'Error cargando perfil:',
        e,
      );

      setError(
        'No fue posible cargar los datos del perfil.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  /**
   * ==============================
   * CAMBIAR CONTRASEÑA
   * ==============================
   */

  const actualizarPassword = useCallback(
    async (): Promise<boolean> => {
      try {
        setProcessing(true);
        setError(null);
        setSuccess(null);

        if (!passwordActual) {
          setError(
            'Ingresa tu contraseña actual.',
          );

          return false;
        }

        if (!nuevaPassword) {
          setError(
            'Ingresa la nueva contraseña.',
          );

          return false;
        }

        if (nuevaPassword.length < 6) {
          setError(
            'La nueva contraseña debe tener al menos 6 caracteres.',
          );

          return false;
        }

        if (
          nuevaPassword !== confirmarPassword
        ) {
          setError(
            'Las nuevas contraseñas no coinciden.',
          );

          return false;
        }

        const passwordActualValida =
          await validatePassword(
            passwordActual,
          );

        if (!passwordActualValida) {
          setError(
            'La contraseña actual es incorrecta.',
          );

          return false;
        }

        await changePassword(
          nuevaPassword,
        );

        setPasswordActual('');
        setNuevaPassword('');
        setConfirmarPassword('');

        setSuccess(
          'Contraseña actualizada correctamente.',
        );

        return true;
      } catch (e) {
        console.error(
          'Error cambiando contraseña:',
          e,
        );

        setError(
          'No fue posible cambiar la contraseña.',
        );

        return false;
      } finally {
        setProcessing(false);
      }
    },
    [
      passwordActual,
      nuevaPassword,
      confirmarPassword,
    ],
  );

  /**
   * ==============================
   * AVATAR
   * ==============================
   */

  const cambiarAvatar = useCallback(
    async (avatar: string) => {
      try {
        setError(null);
        setSuccess(null);

        await saveAvatarUri(avatar);

        setAvatarUri(avatar);

        setSuccess(
          'Avatar actualizado correctamente.',
        );
      } catch (e) {
        console.error(
          'Error cambiando avatar:',
          e,
        );

        setError(
          'No fue posible actualizar el avatar.',
        );
      }
    },
    [],
  );

  const seleccionarFotoGaleria = useCallback(
    async (): Promise<void> => {
      try {
        setError(null);
        setSuccess(null);

        const resultado =
          await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

        if (resultado.canceled) {
          return;
        }

        const uri =
          resultado.assets[0]?.uri;

        if (!uri) {
          return;
        }

        await saveAvatarUri(uri);

        setAvatarUri(uri);

        setSuccess(
          'Foto de perfil actualizada correctamente.',
        );
      } catch (e) {
        console.error(
          'Error seleccionando foto:',
          e,
        );

        setError(
          'No fue posible seleccionar la foto.',
        );
      }
    },
    [],
  );

  const eliminarAvatar = useCallback(
    async () => {
      try {
        setError(null);
        setSuccess(null);

        await removeAvatar();

        setAvatarUri(null);

        setSuccess(
          'Avatar eliminado correctamente.',
        );
      } catch (e) {
        console.error(
          'Error eliminando avatar:',
          e,
        );

        setError(
          'No fue posible eliminar el avatar.',
        );
      }
    },
    [],
  );

  /**
   * ==============================
   * CERRAR SESIÓN
   * ==============================
   */

  const cerrarSesion = useCallback(
    async (): Promise<boolean> => {
      try {
        setProcessing(true);
        setError(null);

        await clearSession();

        return true;
      } catch (e) {
        console.error(
          'Error cerrando sesión:',
          e,
        );

        setError(
          'No fue posible cerrar la sesión.',
        );

        return false;
      } finally {
        setProcessing(false);
      }
    },
    [],
  );

  return {
    email,
    avatarUri,

    loading,
    processing,

    error,
    success,

    passwordActual,
    nuevaPassword,
    confirmarPassword,

    setPasswordActual,
    setNuevaPassword,
    setConfirmarPassword,

    cargarPerfil,

    actualizarPassword,

    cambiarAvatar,
    eliminarAvatar,

    cerrarSesion,
    seleccionarFotoGaleria,
  };
}