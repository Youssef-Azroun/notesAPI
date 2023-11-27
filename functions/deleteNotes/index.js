const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    try {
        const noteId = event.pathParameters.id;

        // Check if the ID is provided in the URL
        if (!noteId) {
            return sendResponse(400, { success: false, message: 'Note ID is missing' });
        }

        const result = await db.delete({
            TableName: 'notes-db',
            Key: {
                id: noteId,
            },
        }).promise();

        // Check if the delete operation was successful (status code 200)
        if (result && result.$response && result.$response.httpResponse.statusCode === 200) {
            return sendResponse(200, { success: true, message: 'Note deleted successfully' });
        } else {
            return sendResponse(404, { success: false, message: 'Note not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return sendResponse(500, { success: false });
    }
};
