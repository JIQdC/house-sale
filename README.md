# 🏡 House Sale

This project is a simple web page created to help sell items during a move. The page dynamically fetches product data from a Google Sheets document and displays it in a user-friendly format. Users can filter products by categories and contact the seller through a Google Form.

## ✨ Features

- 📄 Fetches product data from Google Sheets
- 🏷️ Dynamically generates category buttons based on product data
- 🔍 Filters products based on selected categories
- 📬 Provides a contact form for users to express interest in items

## 📁 Project Structure
- `config.js`: Contains configuration settings such as the Google Sheets ID and Google Form base URL.
- `index.html`: The main HTML file that structures the web page.
- `js/app.js`: The JavaScript file that handles fetching data, generating category buttons, and filtering products.
- `LICENSE`: The MIT License file.
- `README.md`: This file, providing an overview of the project.
- `style.css`: The CSS file that styles the web page.

## 🚀 Usage

1. Clone the repository.
2. Update the `CONFIG` object in `config.js` with your Google Sheets ID and Google Form base URL.
3. Open `index.html` in a web browser to view the page.
4. Install a simple HTTP server. You can use `http-server` by running `npm install -g http-server` or the built-in Python HTTP server.
5. Launch the server:
    - Using `http-server`: Navigate to the project directory and run `http-server`.
    - Using Python: Navigate to the project directory and run `python -m http.server`.
6. Open your web browser and go to `http://localhost:8080` to view the page.

## 🌐 GitHub Pages Deployment

You can easily deploy this project using GitHub Pages by following these steps:

1. Push your code to a GitHub repository if you haven't already.
2. Go to the repository on GitHub.
3. Click on the `Settings` tab.
4. Scroll down to the `Pages` section.
5. Under `Source`, select the branch you want to deploy from (usually `main` or `master`).
6. Click `Save`.

Your site should be available at `https://<your-username>.github.io/<repository-name>` shortly after.

For more detailed instructions, refer to the [GitHub Pages documentation](https://docs.github.com/en/pages).

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

Created by José Quinteros del Castillo.