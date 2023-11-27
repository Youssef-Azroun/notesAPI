const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    try {
        const noteId = event.pathParameters.id;
        const requestBody = JSON.parse(event.body);

        // Check if the ID and request body are provided
        if (!noteId || !requestBody) {
            return sendResponse(400, { success: false, message: 'Note ID or request body is missing' });
        }

        // Fetch the existing note
        const getParams = {
            TableName: 'notes-db',
            Key: {
                id: noteId,
            },
        };

        const existingNote = await db.get(getParams).promise();

        // Check if the note exists
        if (!existingNote || !existingNote.Item) {
            return sendResponse(404, { success: false, message: 'Note not found' });
        }

        // Update the note with the new values
        const updatedNote = {
            ...existingNote.Item,
            title: requestBody.title || existingNote.Item.title,
            text: requestBody.text || existingNote.Item.text,
            modifiedAt: new Date().toISOString(),
        };

        // Save the modified note back to the DynamoDB table
        await db.put({
            TableName: 'notes-db',
            Item: updatedNote,
        }).promise();

        return sendResponse(200, { success: true, message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        return sendResponse(500, { success: false });
    }
};
