const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const requestBody = JSON.parse(event.body);

    try {
        // Validate input
        if (!isValidInput(requestBody)) {
            return sendResponse(400, { success: false, message: 'Invalid input' });
        }

        const id = generateUniqueId();
        const timestamp = new Date().toISOString();

        const note = {
            id,
            title: requestBody.title,
            text: requestBody.text,
            createdAt: timestamp,
            modifiedAt: timestamp,
        };

        await db.put({
            TableName: 'notes-db',
            Item: note,
        }).promise();

        return sendResponse(200, { success: true, id });
    } catch (error) {
        console.error('Error:', error);
        return sendResponse(500, { success: false });
    }
};

function isValidInput(requestBody) {
    return (
        requestBody &&
        requestBody.title &&
        requestBody.text &&
        typeof requestBody.title === 'string' &&
        typeof requestBody.text === 'string' &&
        requestBody.title.length <= 50 &&
        requestBody.text.length <= 300
    );
}

function generateUniqueId() {
    
    return Date.now().toString();
}
