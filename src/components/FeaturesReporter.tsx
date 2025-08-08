import React, { useEffect, useState } from 'react';

interface Feature {
  name: string;
  status: string;
}

const FeaturesReporter: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    // Fetch features from tests.json files
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/path/to/tests.json');
        const data = await response.json();
        setFeatures(data.features);
      } catch (error) {
        console.error('Error fetching features:', error);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <div>
      <h1>Features Reporter</h1>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>
            {feature.name} - {feature.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesReporter;
