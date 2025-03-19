import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChartLine, FaCalendarAlt, FaLeaf } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WastePrediction() {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock crops
  const crops = [
    { id: 'rice', name: 'Rice' },
    { id: 'wheat', name: 'Wheat' },
    { id: 'corn', name: 'Corn' },
    { id: 'sugarcane', name: 'Sugarcane' },
  ];
  
  useEffect(() => {
    fetchPredictionData();
  }, [selectedCrop]);
  
  const fetchPredictionData = async () => {
    setIsLoading(true);
    
    try {
      // This would normally fetch from the API
      // For now, we'll use mock data
      const mockData = {
        rice: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Predicted Waste (kg)',
              data: [0, 0, 0, 0, 0, 300, 500, 450, 400, 350, 200, 0],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
            {
              label: 'Historical Waste (kg)',
              data: [0, 0, 0, 0, 0, 280, 480, 430, 380, 330, 180, 0],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
          ],
        },
        wheat: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Predicted Waste (kg)',
              data: [200, 250, 300, 350, 400, 0, 0, 0, 0, 0, 0, 150],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
            {
              label: 'Historical Waste (kg)',
              data: [180, 230, 280, 330, 380, 0, 0, 0, 0, 0, 0, 130],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
          ],
        },
        corn: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Predicted Waste (kg)',
              data: [0, 0, 0, 150, 250, 350, 400, 450, 300, 200, 0, 0],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
            {
              label: 'Historical Waste (kg)',
              data: [0, 0, 0, 130, 230, 330, 380, 430, 280, 180, 0, 0],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
          ],
        },
        sugarcane: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Predicted Waste (kg)',
              data: [300, 350, 400, 450, 500, 550, 600, 550, 500, 450, 400, 350],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
            {
              label: 'Historical Waste (kg)',
              data: [280, 330, 380, 430, 480, 530, 580, 530, 480, 430, 380, 330],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
          ],
        },
      };
      
      setPredictionData(mockData[selectedCrop]);
    } catch (error) {
      console.error('Error fetching prediction data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        {t('wastePrediction.title')}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {t('wastePrediction.selectCrop')}
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {crops.map((crop) => (
              <motion.button
                key={crop.id}
                onClick={() => setSelectedCrop(crop.id)}
                className={`px-4 py-2 rounded-md flex items-center ${
                  selectedCrop === crop.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLeaf className="mr-2" />
                {crop.name}
              </motion.button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="h-64 md:h-96">
            {predictionData && <Line options={chartOptions} data={predictionData} />}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-green-600" />
            {t('wastePrediction.insights')}
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">
                {t('wastePrediction.peakProduction')}
              </h3>
              <p className="text-green-700">
                {selectedCrop === 'rice' && t('wastePrediction.insights.rice.peak')}
                {selectedCrop === 'wheat' && t('wastePrediction.insights.wheat.peak')}
                {selectedCrop === 'corn' && t('wastePrediction.insights.corn.peak')}
                {selectedCrop === 'sugarcane' && t('wastePrediction.insights.sugarcane.peak')}
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">
                {t('wastePrediction.marketDemand')}
              </h3>
              <p className="text-blue-700">
                {selectedCrop === 'rice' && t('wastePrediction.insights.rice.demand')}
                {selectedCrop === 'wheat' && t('wastePrediction.insights.wheat.demand')}
                {selectedCrop === 'corn' && t('wastePrediction.insights.corn.demand')}
                {selectedCrop === 'sugarcane' && t('wastePrediction.insights.sugarcane.demand')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            {t('wastePrediction.recommendations')}
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-800">
                {t('wastePrediction.optimalTiming')}
              </h3>
              <p className="text-gray-600">
                {selectedCrop === 'rice' && t('wastePrediction.recommendations.rice.timing')}
                {selectedCrop === 'wheat' && t('wastePrediction.recommendations.wheat.timing')}
                {selectedCrop === 'corn' && t('wastePrediction.recommendations.corn.timing')}
                {selectedCrop === 'sugarcane' && t('wastePrediction.recommendations.sugarcane.timing')}
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-800">
                {t('wastePrediction.potentialBuyers')}
              </h3>
              <p className="text-gray-600">
                {selectedCrop === 'rice' && t('wastePrediction.recommendations.rice.buyers')}
                {selectedCrop === 'wheat' && t('wastePrediction.recommendations.wheat.buyers')}
                {selectedCrop === 'corn' && t('wastePrediction.recommendations.corn.buyers')}
                {selectedCrop === 'sugarcane' && t('wastePrediction.recommendations.sugarcane.buyers')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WastePrediction; 