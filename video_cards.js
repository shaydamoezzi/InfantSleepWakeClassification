// Function to create annotator options HTML
function createAnnotatorOptions(annotators) {
    return annotators.map(a => `<option value="${a}">${a}</option>`).join('');
}

// Function to create a video card
function createVideoCard(videoId, metrics) {
    const template = document.getElementById('video-card-template').innerHTML;
    const annotatorOptions = createAnnotatorOptions(metrics.annotators);
    
    return template
        .replace(/{VIDEO_ID}/g, videoId)
        .replace('{FLEISS_KAPPA}', metrics.fleissKappa.toFixed(3))
        .replace(/{ANNOTATOR_OPTIONS}/g, annotatorOptions);
}

// Function to update comparison result
function updateComparisonResult(videoId) {
    const annotator1 = document.getElementById(`annotator1-${videoId}`).value;
    const annotator2 = document.getElementById(`annotator2-${videoId}`).value;
    
    if (annotator1 && annotator2 && annotator1 !== annotator2) {
        const pair = [annotator1, annotator2].sort().join('-');
        const kappa = agreementMetrics[videoId].pairwiseKappa[pair];
        document.getElementById(`comparison-result-${videoId}`).innerHTML = 
            `Kappa Score between ${annotator1} and ${annotator2}: <strong>${kappa.toFixed(3)}</strong>`;
    } else {
        document.getElementById(`comparison-result-${videoId}`).innerHTML = 
            'Please select two different annotators';
    }
}

// Function to create kappa matrix
function createKappaMatrix(videoId, container) {
    const metrics = agreementMetrics[videoId];
    const annotators = metrics.annotators;
    
    let table = '<table class="kappa-matrix"><tr><th></th>';
    annotators.forEach(a => {
        table += `<th>${a}</th>`;
    });
    table += '</tr>';
    
    annotators.forEach(a1 => {
        table += `<tr><th>${a1}</th>`;
        annotators.forEach(a2 => {
            if (a1 === a2) {
                table += '<td>1.000</td>';
            } else {
                const pair = [a1, a2].sort().join('-');
                const kappa = metrics.pairwiseKappa[pair];
                table += `<td>${kappa.toFixed(3)}</td>`;
            }
        });
        table += '</tr>';
    });
    table += '</table>';
    
    container.innerHTML = table;
}

// Initialize video cards when page loads
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('video-cards');
    Object.entries(agreementMetrics).forEach(([videoId, metrics]) => {
        const cardHtml = createVideoCard(videoId, metrics);
        container.insertAdjacentHTML('beforeend', cardHtml);
        
        // Create kappa matrix for this video
        const matrixContainer = document.getElementById(`kappa-matrix-${videoId}`);
        if (matrixContainer) {
            createKappaMatrix(videoId, matrixContainer);
        }
    });
}); 