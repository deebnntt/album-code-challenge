
add error when there are users 1 and 2 are the same
addtional styling
// make the box have an automatic height with flex box

// 1. Display - GET USERS with id 1 and 2, and their associated ALBUMS from the mock-API. Using the
// provided template, display the response data in two tables representing each user.

2. UI - Implement drag-and-drop. I should be able to drag a row from one table, and drop it into the other.
Doing so should trigger an AJAX request, updating the `userId` property on the ALBUM. When the
request resolves, you should utilize the data in the response to make the appropriate changes in the
display. We want to make sure the UI is consistent with the data at all costs.
 NOTE: The mock-api will not actually persist anything you send to it

// 3. Text Search - So many albums, so little time. Include a text input above each table that permits filtering
// albums by title. Filtering should cause only albums with titles that at least partially match the input to
// display in the table.

4. Colors! - Bring this webpage a little more life by candy-striping the rows in each table, and highlighting
rows on mouse-over.

// 5. I Fight for the Users! - It isn’t fair that only Leanne and Ervin are invited to the party. Allow users to
// swap albums between any users that the API has access to.

// 6. A Force to be Beckoned With - I hear people still don’t understand how to use this webpage. When
// users start dragging a row, come up with a way to beckon them to drop it on the other table by
// indicating a dropzone somehow.
//
// 7. The Incredible Bulk - We don’t have time to be dragging around all these rows. Let’s allow users to
// select multiple rows, and drag them together in bulk. You’ll still have to make a PUT request for each
// one separately though.
