import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSectors, getProgress, getFarmInputs } from '../services/api';
import { Search, ChevronDown } from 'lucide-react';

// Mock data for demonstration
const SECTORS = ['Produção de Tabaco', 'Produção de Amendoim', 'Produção de Milho', 'Produção de Algodão'];
const AREAS = ['Namicopo', 'Chokwe', 'Manhica', 'Vilanculos', 'Xai-Xai', 'Mocuba'];
const TECHNICIANS = [
  'João Silva', 'Maria Santos', 'Alexandre Mondlane', 'Tomas Machel', 'Ana Marrengula',
  'Carlos Tembe', 'Isabel Macamo', 'Paulo Cossa', 'Sofia Guambe', 'Lucas Sitoe'
];

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const { data: sectors } = useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors
  });

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: getProgress
  });

  const { data: farmInputs } = useQuery({
    queryKey: ['farmInputs'],
    queryFn: getFarmInputs
  });

  // Generate mock data for 20 weeks
  const generateWeeklyData = () => {
    return Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      sector: SECTORS[Math.floor(Math.random() * SECTORS.length)],
      area: AREAS[Math.floor(Math.random() * AREAS.length)],
      technician: `Técnico ${TECHNICIANS[Math.floor(Math.random() * TECHNICIANS.length)]}`,
      weeks: Array.from({ length: 20 }, (_, weekIndex) => ({
        sales: Math.floor(Math.random() * 50),
        accumulated: 0
      }))
    })).map(worker => {
      let accumulator = 0;
      worker.weeks = worker.weeks.map(week => {
        accumulator += week.sales;
        return { ...week, accumulated: accumulator };
      });
      return worker;
    });
  };

  const weeklyData = generateWeeklyData();

  const filteredData = weeklyData.filter(item => 
    item.technician.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedSector || item.sector === selectedSector) &&
    (!selectedArea || item.area === selectedArea)
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Painel de Insumos</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Adicionar Distribuição
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Exportar Relatórios
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="space-y-8">
          {/* Analysis and Progress Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col space-y-4 mb-6">
              <h2 className="text-xl font-bold text-white">Análises - Progresso</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar por..."
                    className="w-full bg-gray-700 text-white rounded px-4 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
                <select
                  className="bg-gray-700 text-white rounded px-3 py-2"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  <option value="">Selecione o sector</option>
                  {SECTORS.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
                <select
                  className="bg-gray-700 text-white rounded px-3 py-2"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  <option value="">Selecione a área</option>
                  {AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <select className="bg-gray-700 text-white rounded px-3 py-2">
                  <option>Registro</option>
                  <option value="inputs">Insumos</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 sticky left-0 bg-gray-800">Sector</th>
                    <th className="text-left py-2 px-4 sticky left-[150px] bg-gray-800">Área</th>
                    <th className="text-left py-2 px-4 sticky left-[300px] bg-gray-800">Técnico</th>
                    {Array.from({ length: 20 }, (_, i) => (
                      <th key={i} className="text-center py-2 px-8" colSpan={2}>
                        Semana {i + 1}
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-700">
                    <th className="sticky left-0 bg-gray-800" colSpan={3}></th>
                    {Array.from({ length: 20 }, (_, i) => (
                      <React.Fragment key={i}>
                        <th className="text-center py-2 px-4">Vendas</th>
                        <th className="text-center py-2 px-4">Total</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-2 px-4 sticky left-0 bg-gray-800">{row.sector}</td>
                      <td className="py-2 px-4 sticky left-[150px] bg-gray-800">{row.area}</td>
                      <td className="py-2 px-4 sticky left-[300px] bg-gray-800">{row.technician}</td>
                      {row.weeks.map((week, weekIndex) => (
                        <React.Fragment key={weekIndex}>
                          <td className="text-center py-2 px-4">{week.sales}</td>
                          <td className="text-center py-2 px-4">{week.accumulated}</td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inputs Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Insumos</h2>
              <div className="flex space-x-4">
                <select className="bg-gray-700 text-white rounded px-3 py-2">
                  <option value="">Sector</option>
                  {SECTORS.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
                <select className="bg-gray-700 text-white rounded px-3 py-2">
                  <option value="">Área</option>
                  {AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Sector</th>
                    <th className="text-left py-2">Área</th>
                    <th className="text-left py-2">Técnico</th>
                    <th className="text-center py-2">Produtores</th>
                    <th className="text-center py-2" colSpan={2}>Semente X</th>
                    <th className="text-center py-2" colSpan={2}>Semente Y</th>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <th colSpan={4}></th>
                    <th className="text-center py-2">Distribuídos</th>
                    <th className="text-center py-2">Recebidos</th>
                    <th className="text-center py-2">Distribuídos</th>
                    <th className="text-center py-2">Recebidos</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyData.slice(0, 10).map((row, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-2">{row.sector}</td>
                      <td className="py-2">{row.area}</td>
                      <td className="py-2">{row.technician}</td>
                      <td className="text-center py-2">{`PRD${String(index + 1).padStart(4, '0')}`}</td>
                      <td className="text-center py-2">{Math.floor(Math.random() * 100)}</td>
                      <td className="text-center py-2">{Math.floor(Math.random() * 100)}</td>
                      <td className="text-center py-2">{Math.floor(Math.random() * 100)}</td>
                      <td className="text-center py-2">{Math.floor(Math.random() * 100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};