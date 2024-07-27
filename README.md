![Logo](src/assets/logo-light.svg)

This is a webapp that holds and presents images, for drawing reference. This repo holds the frontend React app.

See the [planning document](https://github.com/DanielOaks/drawref-backend/blob/main/PLANNING.md) for details about the project design and future plans, and the [backend repo](https://github.com/DanielOaks/drawref-backend) for the interface.

## Environment variables

You can configure the frontend through these environment variables:

- `VITE_DRAWREF_API`: The backend address, with `/api/` at the end.
- `VITE_DRAWREF_UPLOAD`: The backend address, with `/upload/` at the end.

These environment variables also work on the docker image.

## Docker quick start

You can get the frontend up and running quickly with Docker. Note, this runs a development build, and is not appropriate for production hosting.

The [quick start instructions on the backend](https://github.com/DanielOaks/drawref-backend#docker-quick-start) explain starting both components.

But here is just starting the frontend:

```bash
docker run -it -e VITE_DRAWREF_API=http://localhost:3300/api/ -e VITE_DRAWREF_UPLOAD=http://localhost:3300/upload/ -p 3000:3000 ghcr.io/danieloaks/drawref-frontend:main
```

Finally, access the app on port 3000. If running the command locally, at http://localhost:3000

## Development

If you want to get started developing the app, you can use the below commands.

### Setup

Make sure to install the dependencies:

```bash
asdf install  # sets up the right version of nodejs
yarn install
```

### Development Server

Start the development server on http://localhost:3000

```bash
yarn dev
```

### Testing

Run the test suite:

```bash
yarn test
```

See [create-react-app / running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Production

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

See [create-react-app / deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

```bash
yarn build
```

<!-- ## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify) -->

# License

This software is released under the ISC license.
