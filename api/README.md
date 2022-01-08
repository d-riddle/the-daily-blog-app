# The Daily Blog App

This web App is deployed on heroku. The Link to the App is [The-Daily-Blog-App](https://the-daily-blog-app.herokuapp.com/).


As the name suggests this project allows to create and display modern and stylish blog articles and perform CRUD operations on it with JWT authentication.

## Features

**REGISTER**: User need to register to the app if they want to create blog articles on this app.

**LOGIN**: Allows user to login on this app, creating Json web token which is used to authenticate the user, when he performs various operations.

**HOME**: Displays all the blogs created so far. On the sidebar there is category section which allows users to view all the blogs in that category.

**WRITE**: It allows users to upload a cover image for thier article, write a appealing title, choose the category in which the article resides you can more than one, and then write the body of the article in the markdown editor which has built in support for live preview. When you want to publish this article click on publish button, the image is first uploaded in `Firebase`, while the image is bieng uploaded it shows the progress of upload. When the progress shows 100%, the link of image that is returned from the firebase along with other data of this article (title, body, author etc.) is stored in `MongoDB`. It then automatically redirects to page which shows the article after it is published.

**ARTICLE Page**: Clicking on any article's title on `HOME` page takes the user to a page showing the complete article along with author and time at which this article was created. If user is admin or the author of the article then the edit and delete button will be displayed otherwise edit and delete button will not be displayed. Edit button allows user to edit the article and delete button allows user to delete the article.

**SETTINGS**: Here the user can update his/her account info like profile picture, username, email and password. There is also a delete account button which allows user to delete his/her account from the app.

**Query based on Category**: On the `SideBar` there is Category section, Clicking on a particular category queries all the articles that belongs to that particular category.

## Technologies Used:

**Front-End**: ReactJs, HTML and CSS

**Back-End**: NodeJS, Express, MongoDB, jsonwebtoken

`FireBase` is used in front-end along with `react` to upload images.

`react-md-editor` is used in front-end for markdown writing. 