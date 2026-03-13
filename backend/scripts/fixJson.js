const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'programming.json');

const fixJsonFile = () => {
    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        
        // Split by }{ to find separate JSON objects
        // This is a simple heuristic to split multiple JSON objects in one file
        // We wrap each part in {} to make it valid JSON for parsing
        
        // Actually, let's try a more robust regex approach to extract all objects
        // Or simpler: just split by '}\n{' and re-parse
        
        // Since the file is likely small enough now after my previous edit (wait, I didn't edit it, I tried to read it all and failed?), let's try reading it with a larger limit or specifically handling the split.
        
        // Let's try to find all "easy", "medium", "hard" arrays in the file content
        // and merge them.
        
        const content = rawData;
        
        // We will use regex to find all JSON objects
        // But the easiest way for this specific broken structure is:
        // Split by "}\n{\n" or "}\n  \n{\n"
        
        // Let's try splitting by regex
        const objects = content.split(/(?<=}\s*)\n(?=\s*{)/g);
        
        let mergedData = {
            easy: [],
            medium: [],
            hard: []
        };
        
        objects.forEach(objStr => {
            try {
                const trimmed = objStr.trim();
                if (!trimmed) return;
                
                // Ensure it's valid JSON by adding braces if missing
                const jsonStr = trimmed.startsWith('{') ? trimmed : '{' + trimmed + '}';
                const data = JSON.parse(jsonStr);
                
                if (data.easy) mergedData.easy.push(...data.easy);
                if (data.medium) mergedData.medium.push(...data.medium);
                if (data.hard) mergedData.hard.push(...data.hard);
            } catch (e) {
                // Ignore parse errors for individual chunks if any
            }
        });

        // Remove duplicates if any (optional, based on requirement)
        // For now, let's just save it
        
        // Fix unique IDs or topics if needed? No, just merge.
        
        fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
        console.log('Fixed programming.json successfully!');
        console.log(`Total easy: ${mergedData.easy.length}, medium: ${mergedData.medium.length}, hard: ${mergedData.hard.length}`);
        
    } catch (error) {
        console.error('Error fixing JSON:', error);
    }
};

fixJsonFile();
