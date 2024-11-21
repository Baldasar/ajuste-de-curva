import { useState } from "react";
import regression from "regression";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [coordenadas, setCoordenadas] = useState([{ x: 0, y: 0 }]);
  const [tipoRotulo, setTipoRotulo] = useState("Nenhum gráfico formado");
  const [lei, setLei] = useState("");
  const [dados, setDados] = useState([]);

  function modeloMelhorAjuste(pontos) {
    const linear = regression.linear(pontos);
    const exponencial = regression.exponential(pontos);
    const logaritmica = regression.logarithmic(pontos);
    const potencia = regression.power(pontos);
    const polinomial = regression.polynomial(pontos, { order: 2 });

    const modelos = [
      { nome: "Linear", modelo: linear },
      { nome: "Exponencial", modelo: exponencial },
      { nome: "Logarítmica", modelo: logaritmica },
      { nome: "Potência", modelo: potencia },
      { nome: "Polinomial", modelo: polinomial },
    ];

    let melhorModelo = modelos[0];
    modelos.forEach((modelo) => {
      if (modelo.modelo.r2 > melhorModelo.modelo.r2) {
        melhorModelo = modelo;
      }
    });

    setLei(melhorModelo.modelo.string);
    return melhorModelo;
  }

  function handleVerificar() {
    const pontos = coordenadas.map((coord) => [coord.x, coord.y]);
    const melhorModelo = modeloMelhorAjuste(pontos);
    setTipoRotulo(melhorModelo.nome);

    const dadosModelo = melhorModelo.modelo.points.map((ponto) => ({
      x: ponto[0],
      y: ponto[1],
    }));
    setDados(dadosModelo);
  }

  const removerUltimaLinha = () => {
    if (coordenadas.length > 1) {
      setCoordenadas(coordenadas.slice(0, -1));
    }
  };

  const adicionarLinha = () => {
    setCoordenadas([...coordenadas, { x: 0, y: 0 }]);
  };

  const handleAlterarCoordenada = (index, eixo, valor) => {
    const coordenadasAtualizadas = coordenadas.map((coord, i) =>
      i === index ? { ...coord, [eixo]: Number(valor) } : coord
    );
    setCoordenadas(coordenadasAtualizadas);
  };

  const valorMinimo = Math.min(
    Math.min(...coordenadas.map((coord) => coord.x)),
    Math.min(...coordenadas.map((coord) => coord.y))
  );
  const valorMaximo = Math.max(
    Math.max(...coordenadas.map((coord) => coord.x)),
    Math.max(...coordenadas.map((coord) => coord.y))
  );

  return (
    <div className="w-full h-screen p-6 bg-gray-100 text-gray-900 flex">
      <div className="w-2/5 flex flex-col items-center justify-center">
        <table className="table-fixed border-collapse border border-gray-300 bg-white shadow-md">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">X</th>
              <th className="border border-gray-300 px-4 py-2">Y</th>
            </tr>
          </thead>
          <tbody>
            {coordenadas.map((coord, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={coord.x}
                    onChange={(e) =>
                      handleAlterarCoordenada(index, "x", e.target.value)
                    }
                    className="w-full p-2 bg-gray-50 text-gray-900 rounded border border-gray-300"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={coord.y}
                    onChange={(e) =>
                      handleAlterarCoordenada(index, "y", e.target.value)
                    }
                    className="w-full p-2 bg-gray-50 text-gray-900 rounded border border-gray-300"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4 mt-4">
          <button
            onClick={adicionarLinha}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white shadow-md"
          >
            Adicionar Linha
          </button>
          <button
            onClick={handleVerificar}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white shadow-md"
          >
            Verificar
          </button>
          <button
            onClick={removerUltimaLinha}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white shadow-md"
          >
            Remover Última Linha
          </button>
        </div>
      </div>

      <div className="w-3/5 flex flex-col items-center justify-center border border-gray-300 bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-center">{tipoRotulo}</h3>
        <h3 className="text-lg mb-4 text-center">{lei}</h3>

        <div
          style={{
            width: "100%",
            maxWidth: "750px",
            height: "750px",
            margin: "0 auto",
          }}
        >
          <Line
            data={{
              datasets: [
                {
                  label: `${tipoRotulo} Modelo`,
                  data: dados,
                  borderColor: "rgba(75,192,192,1)",
                  backgroundColor: "rgba(75,192,192,0.2)",
                  tension: 0.2,
                  parsing: {
                    xAxisKey: "x",
                    yAxisKey: "y",
                  },
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 1,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    color: "#333",
                    font: {
                      size: 14,
                      family: "Arial, sans-serif",
                    },
                    padding: 20,
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  padding: 10,
                  cornerRadius: 4,
                  displayColors: false,
                },
                title: {
                  display: true,
                  text: "Título do Gráfico",
                  color: "#333",
                  font: {
                    size: 18,
                    weight: "bold",
                    family: "Arial, sans-serif",
                  },
                  padding: 20,
                },
              },
              scales: {
                x: {
                  type: "linear",
                  min: valorMinimo,
                  max: valorMaximo,
                  grid: {
                    display: true,
                    color: "rgba(200, 200, 200, 0.2)",
                  },
                  ticks: {
                    stepSize: 1,
                    callback: function (value) {
                      return value;
                    },
                    color: "#666",
                    font: {
                      size: 12,
                    },
                  },
                  title: {
                    display: true,
                    text: "Eixo X",
                    color: "#333",
                    font: {
                      size: 14,
                      family: "Arial, sans-serif",
                    },
                  },
                },
                y: {
                  type: "linear",
                  min: valorMinimo,
                  max: valorMaximo,
                  grid: {
                    display: true,
                    color: "rgba(200, 200, 200, 0.2)",
                  },
                  ticks: {
                    stepSize: 1,
                    callback: function (value) {
                      return value;
                    },
                    color: "#666",
                    font: {
                      size: 12,
                    },
                  },
                  title: {
                    display: true,
                    text: "Eixo Y",
                    color: "#333",
                    font: {
                      size: 14,
                      family: "Arial, sans-serif",
                    },
                  },
                },
              },
              layout: {
                padding: {
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
