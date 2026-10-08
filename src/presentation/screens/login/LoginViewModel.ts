import { useCallback, useEffect, useState } from 'react';

import {
  createLocalUser,
  getLocalEmail,
  hasLocalUser,
  validatePassword,
} from '../../../data/storage/authStorage';

import {
  getAvatarUri,
  saveAvatarUri,
  setSessionActive,
} from '../../../data/storage/appStorage';

export interface ResultadoOperacion {
  ok: boolean;
  error?: string;
}

const DEFAULT_AVATAR = 'default';

export function useLoginViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Determina si ya existe un usuario local.
   */
  const verificarUsuario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const existeUsuario = await hasLocalUser();

      if (existeUsuario) {
        const emailGuardado = await getLocalEmail();

        if (emailGuardado) {
          setEmail(emailGuardado);
        }

        setIsRegisterMode(false);
      } else {
        setIsRegisterMode(true);
      }
    } catch (e) {
      console.error(
        'Error verificando usuario local:',
        e,
      );

      setError(
        'No fue posible verificar el usuario local.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verificarUsuario();
  }, [verificarUsuario]);

  /**
   * Inicia sesión con el usuario local.
   */
  const iniciarSesion = useCallback(async (): Promise<ResultadoOperacion> => {
    try {
      setProcessing(true);
      setError(null);

      const emailNormalizado = email
        .trim()
        .toLowerCase();

      if (!emailNormalizado) {
        setError('Ingresa tu correo electrónico.');
        return {
          ok: false,
          error: 'Ingresa tu correo electrónico.',
        };
      }

      if (!password) {
        setError('Ingresa tu contraseña.');
        
        return {
          ok: false,
          error: 'Ingresa tu contraseña.',
        };
      }

      const emailGuardado = await getLocalEmail();

      if (
        !emailGuardado ||
        emailGuardado.toLowerCase() !== emailNormalizado
      ) {
        setError(
          'El correo electrónico no corresponde al usuario registrado.',
        );

        return {
          ok: false,
          error: 'El correo electrónico no corresponde al usuario registrado.',
        };
      }

      const passwordValida =
        await validatePassword(password);

      if (!passwordValida) {
        setError('La contraseña es incorrecta.');
        return {
          ok: false,
          error: 'La contraseña es incorrecta.',
        };
      }

      await setSessionActive();

      return {
        ok: true,
      };
    } catch (e) {
      console.error(
        'Error iniciando sesión:',
        e,
      );

      setError(
        'No fue posible iniciar sesión.',
      );

      return {
        ok: false,
        error: 'No fue posible iniciar sesión.',
      };
    } finally {
      setProcessing(false);
    }
  }, [email, password]);

  /**
   * Crea el primer usuario local.
   */
  const registrarUsuario = useCallback(
    async (): Promise<ResultadoOperacion> => {
      try {
        setProcessing(true);
        setError(null);

        const emailNormalizado = email
          .trim()
          .toLowerCase();

        if (!emailNormalizado) {
          setError(
            'Ingresa tu correo electrónico.',
          );

          return { ok: false, error: 'Ingresa tu correo electrónico.' }; 
        }

        if (!emailNormalizado.includes('@')) {
          setError(
            'Ingresa un correo electrónico válido.',
          );

          return { ok: false, error: 'Ingresa un correo electrónico válido.' };
        }

        if (!password) {
          setError(
            'Ingresa una contraseña.',
          );

          return { ok: false, error: 'Ingresa una contraseña.' };
        }

        if (password.length < 6) {
          setError(
            'La contraseña debe tener al menos 6 caracteres.',
          );

          return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
        }

        if (password !== confirmPassword) {
          setError(
            'Las contraseñas no coinciden.',
          );

          return { ok: false, error: 'Las contraseñas no coinciden.' };
        }

        const existeUsuario =
          await hasLocalUser();

        if (existeUsuario) {
          setError(
            'Ya existe un usuario registrado en este dispositivo.',
          );

          setIsRegisterMode(false);

          return { ok: false, error: 'Ya existe un usuario registrado en este dispositivo.' };
        }

        await createLocalUser(
          emailNormalizado,
          password,
        );

        /**
         * Avatar inicial.
         *
         * Se guarda un identificador simple.
         * Posteriormente Mi Perfil permitirá
         * cambiarlo.
         */
        const avatarActual =
          await getAvatarUri();

        if (!avatarActual) {
          await saveAvatarUri(
            DEFAULT_AVATAR,
          );
        }

        await setSessionActive();

        return { ok: true };

      } catch (e) {
        console.error(
          'Error registrando usuario:',
          e,
        );

        setError(
          'No fue posible crear el usuario.',
        );

        return { ok: false, error: 'No fue posible crear el usuario.' };
        
      } finally {
        setProcessing(false);
      }
    },
    [email, password, confirmPassword],
  );

  /**
   * Alterna entre login y registro.
   *
   * En condiciones normales el registro solamente
   * aparece cuando no existe usuario.
   */
  const cambiarModo = useCallback(() => {
    setError(null);
    setPassword('');
    setConfirmPassword('');

    setIsRegisterMode((actual) => !actual);
  }, []);

  return {
    email,
    password,
    confirmPassword,

    setEmail,
    setPassword,
    setConfirmPassword,

    isRegisterMode,

    loading,
    processing,
    error,

    iniciarSesion,
    registrarUsuario,
    cambiarModo,
    verificarUsuario,
  };
}