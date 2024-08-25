import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON structure: "data" should be an array.');
      }
      setError(null);
      
      const apiResponse = await axios.post('https://21bce11129.vercel.app/bfhl', { data: parsedData.data });
      setResponse(apiResponse.data);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const selectedValues = selectedOptions.map(option => option.value);
    const result = {};

    if (selectedValues.includes('alphabets')) {
      result.alphabets = response.alphabets;
    }
    if (selectedValues.includes('numbers')) {
      result.numbers = response.numbers;
    }
    if (selectedValues.includes('highest_lowercase_alphabet')) {
      result.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Backend Data Processor</h1>
      <textarea
        rows="4"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here, e.g., { "data": ["A", "B", "c", "3"] }'
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div>
          <h3>Select what to display:</h3>
          <Select
            isMulti
            options={options}
            onChange={handleChange}
          />
        </div>
      )}

      {renderResponse()}
    </div>
  );
}

export default App;
