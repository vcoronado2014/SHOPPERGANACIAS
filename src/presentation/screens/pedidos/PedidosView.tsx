import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

import { useFocusEffect } from 'expo-router';

import {
  Alert,
  FlatList,
  Text,
  View,
} from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';

import {
  getConfiguracion,
} from '../../../data/storage/appStorage';

import {
  NuevoPedido,
  usePedidoViewModel,
} from './PedidoViewModel';

import {
  useTheme,
} from '../../theme/ThemeProvider';

import {
  useSnackBar,
} from '../../components/snackbar/useSnackBar';

import PedidoForm from './components/PedidoForm';
import PedidoCard from './components/PedidoCard';
import BonoDiaSection from './components/BonoDiaSection';
import ResumenDia from './components/ResumenDia';

import { styles } from './PedidosStyles';

interface BonoForm {
  id: string;
  descripcion: string;
  monto: number;
}

const obtenerFechaHoy = (): string => {
  const fecha = new Date();

  const year = fecha.getFullYear();

  const month = String(
    fecha.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    fecha.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const crearBonoVacio = (): BonoForm => ({
  id: `${Date.now()}-${Math.random()}`,
  descripcion: '',
  monto: 0,
});

export default function PedidosView() {
  const theme = useTheme();
  const { mostrarSnackBar } = useSnackBar();

  const db = useSQLiteContext();

  const {
    pedidos,
    bonosDia,
    resultadoDia,
    loading,
    error,
    cargarPedidos,
    guardarPedido,
    editarPedido,
    borrarPedido,
    agregarBonoDia,
    borrarBonoDia,
  } = usePedidoViewModel(db);


  const [fecha, setFecha] =
    useState(obtenerFechaHoy());

  const [
    ventanasHorarias,
    setVentanasHorarias,
  ] = useState<
    Awaited<
      ReturnType<typeof getConfiguracion>
    >['ventanasHorarias']
  >([]);

  const [numeroOrden, setNumeroOrden] =
    useState('');

  const [ventanaInicio, setVentanaInicio] =
    useState('');

  const [ventanaFin, setVentanaFin] =
    useState('');

  const [cantidadSku, setCantidadSku] =
    useState('');

  const [kilometros, setKilometros] =
    useState('');

  const [bonos, setBonos] =
    useState<BonoForm[]>([]);

  const [
    bonoDiaDescripcion,
    setBonoDiaDescripcion,
  ] = useState('');

  const [bonoDiaMonto, setBonoDiaMonto] =
    useState('');

  const [
    pedidoEditandoId,
    setPedidoEditandoId,
  ] = useState<number | null>(null);

  useEffect(() => {
    cargarPedidos(fecha);
  }, [fecha, cargarPedidos]);

  useFocusEffect(
    useCallback(() => {
      const cargarVentanasHorarias =
        async () => {
          try {
            const configuracion =
              await getConfiguracion();

            setVentanasHorarias(
              configuracion.ventanasHorarias,
            );
          } catch (error) {
            console.error(
              'Error cargando ventanas horarias:',
              error,
            );
          }
        };

      cargarVentanasHorarias();
    }, []),
  );

  const agregarBono = () => {
    setBonos((actuales) => [
      ...actuales,
      crearBonoVacio(),
    ]);
  };

  const actualizarBono = (
    id: string,
    campo: 'descripcion' | 'monto',
    valor: string,
  ) => {
    setBonos((actuales) =>
      actuales.map((bono) => {
        if (bono.id !== id) {
          return bono;
        }

        if (campo === 'descripcion') {
          return {
            ...bono,
            descripcion: valor,
          };
        }

        return {
          ...bono,
          monto:
            Number(
              valor.replace(/[^0-9]/g, ''),
            ) || 0,
        };
      }),
    );
  };

  const eliminarBono = (id: string) => {
    setBonos((actuales) =>
      actuales.filter(
        (bono) => bono.id !== id,
      ),
    );
  };

  const totalBonosFormulario = useMemo(() => {
    return bonos.reduce(
      (total, bono) =>
        total + bono.monto,
      0,
    );
  }, [bonos]);

  const limpiarFormulario = () => {
    setNumeroOrden('');
    setVentanaInicio('');
    setVentanaFin('');
    setCantidadSku('');
    setKilometros('');
    setBonos([]);
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    setPedidoEditandoId(null);
  };

  const editar = (pedidoId: number) => {
    const seleccionado = pedidos.find(
      (item) =>
        item.pedido.id === pedidoId,
    );

    if (!seleccionado) {
/*       Alert.alert(
        'Error',
        'No fue posible cargar el pedido.',
      ); */
      mostrarSnackBar(
        'No fue posible cargar el pedido.',
        'error'
      );
      return;
    }

    const pedido = seleccionado.pedido;

    setPedidoEditandoId(pedido.id);
    setFecha(pedido.fecha);
    setNumeroOrden(pedido.numeroOrden);
    setVentanaInicio(
      pedido.ventanaInicio,
    );
    setVentanaFin(pedido.ventanaFin);
    setCantidadSku(
      String(pedido.cantidadSku),
    );
    setKilometros(
      String(pedido.kilometros),
    );

    setBonos(
      seleccionado.bonos.map((bono) => ({
        id: String(bono.id),
        descripcion: bono.descripcion,
        monto: bono.monto,
      })),
    );
  };

  const guardar = async () => {
    if (!numeroOrden.trim()) {
      mostrarSnackBar(
        'Ingresa el número de orden.',
        'error',
        5000,
      );

      return;
    }

    const datosPedido: NuevoPedido = {
      numeroOrden: numeroOrden.trim(),
      fecha,
      ventanaInicio,
      ventanaFin,
      cantidadSku:
        Number(cantidadSku) || 0,
      kilometros:
        Number(kilometros) || 0,
      bonos: bonos.map((bono) => ({
        descripcion: bono.descripcion,
        monto: bono.monto,
      })),
    };

    if (pedidoEditandoId !== null) {
      const resultado =
        await editarPedido(
          pedidoEditandoId,
          datosPedido,
        );

      if (!resultado.ok) {
        mostrarSnackBar(
          resultado.error ??
          'No fue posible actualizar el pedido.',
          'error',
          5000,
        );

        return;
      }

      limpiarFormulario();
      setPedidoEditandoId(null);

      mostrarSnackBar(
        'El pedido fue actualizado correctamente.',
        'success',
      );

      return;
    }

    const resultado =
      await guardarPedido(datosPedido);

    if (!resultado.ok) {
      mostrarSnackBar(
        resultado.error ??
        'No fue posible guardar el pedido.',
        'error',
        5000,
      );

      return;
    }

    limpiarFormulario();

    mostrarSnackBar(
      'El pedido fue registrado correctamente.',
      'success',
    );
  };

  const confirmarEliminar = (
    pedidoId: number,
  ) => {
    Alert.alert(
      'Eliminar pedido',
      '¿Quieres eliminar este pedido?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const resultado =
              await borrarPedido(
                pedidoId,
                fecha,
              );

            if (!resultado.ok) {
              mostrarSnackBar(
                resultado.error ??
                  'No fue posible eliminar el pedido.',
                'error',
                5000,
              );

              return;
            }

            if (pedidoEditandoId === pedidoId) {
              cancelarEdicion();
            }

            mostrarSnackBar(
              'El pedido fue eliminado correctamente.',
              'success',
            );
          },
        },
      ],
    );
  };

  const guardarBonoDia = async () => {
    const monto = Number(
      bonoDiaMonto.replace(',', '.'),
    );

    if (
      bonoDiaDescripcion.trim() === '' ||
      !Number.isFinite(monto) ||
      monto <= 0
    ) {
      mostrarSnackBar(
        'La descripción y el monto del bono son obligatorios.',
        'error',
        5000,
      );

      return;
    }

    const resultado =
      await agregarBonoDia(
        fecha,
        bonoDiaDescripcion,
        monto,
      );

    if (!resultado.ok) {
      mostrarSnackBar(
        resultado.error ??
        'No fue posible agregar el bono del día.',
        'error',
        5000,
      );

      return;
    }

    setBonoDiaDescripcion('');
    setBonoDiaMonto('');

    mostrarSnackBar(
      'Bono del día guardado correctamente.',
      'success',
    );
  };

  const eliminarBonoDia = async (
    bonoId: number,
  ) => {
    const resultado =
      await borrarBonoDia(
        bonoId,
        fecha,
      );

    if (!resultado.ok) {
      mostrarSnackBar(
        resultado.error ??
        'No fue posible eliminar el bono del día.',
        'error',
        5000,
      );

      return;
    }

    mostrarSnackBar(
      'Bono del día eliminado correctamente.',
      'success',
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      <FlatList
        data={pedidos}
        keyExtractor={(item) =>
          String(item.pedido.id)
        }
        renderItem={({ item }) => (
          <PedidoCard
            pedido={item.pedido}
            resultado={item.resultado}
            onEditar={editar}
            onEliminar={
              confirmarEliminar
            }
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
        ListHeaderComponent={
          <View>
            <PedidoForm
              fecha={fecha}
              numeroOrden={numeroOrden}
              ventanaInicio={ventanaInicio}
              ventanaFin={ventanaFin}
              ventanasHorarias={ventanasHorarias}
              cantidadSku={cantidadSku}
              kilometros={kilometros}
              bonos={bonos}
              totalBonos={totalBonosFormulario}
              loading={loading}
              error={error}
              modo={
                pedidoEditandoId !== null
                  ? 'editar'
                  : 'crear'
              }
              onFechaChange={setFecha}
              onNumeroOrdenChange={
                setNumeroOrden
              }
              onVentanaChange={(
                inicio,
                fin,
              ) => {
                setVentanaInicio(inicio);
                setVentanaFin(fin);
              }}
              onCantidadSkuChange={
                setCantidadSku
              }
              onKilometrosChange={
                setKilometros
              }
              onAgregarBono={agregarBono}
              onActualizarBono={
                actualizarBono
              }
              onEliminarBono={
                eliminarBono
              }
              onGuardar={guardar}
              onCancelarEdicion={
                cancelarEdicion
              }
            />

            <BonoDiaSection
              bonosDia={bonosDia}
              descripcion={
                bonoDiaDescripcion
              }
              monto={bonoDiaMonto}
              loading={loading}
              onDescripcionChange={
                setBonoDiaDescripcion
              }
              onMontoChange={
                setBonoDiaMonto
              }
              onGuardar={
                guardarBonoDia
              }
              onEliminar={
                eliminarBonoDia
              }
            />

            <ResumenDia
              pedidos={pedidos}
              resultadoDia={
                resultadoDia
              }
            />
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <Text
              style={[
                styles.empty,
                {
                  color: theme.colors.muted,
                },
              ]}
            >
              No hay pedidos registrados
              para este día.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
