document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchType = document.getElementById('search-type').value;
    const searchQuery = document.getElementById('search-query').value.trim().toLowerCase();

    console.log('Search Type:', searchType);
    console.log('Search Query:', searchQuery);

    // Load the Excel file and parse it
    fetch('students.xlsx')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            console.log('Parsed JSON Data:', jsonData);

            // Perform the search
            const result = jsonData.find(student => {
                if (searchType === 'name') {
                    return student.Name.toLowerCase() === searchQuery;
                } else if (searchType === 'rollnumber') {
                    return student.RollNumber.toLowerCase() === searchQuery;
                } else if (searchType === 'uid') {
                    return student.UID.toLowerCase() === searchQuery;
                }
            });

            console.log('Search Result:', result);

            // Display the result
            const resultContainer = document.getElementById('result-container');
            resultContainer.innerHTML = result ? JSON.stringify(result, null, 2) : 'No student found';
        })
        .catch(error => {
            console.error('Error loading the Excel file:', error);
            const resultContainer = document.getElementById('result-container');
            resultContainer.innerHTML = 'Error loading the Excel file: ' + error.message;
        });
});
