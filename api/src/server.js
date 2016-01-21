import app from './app'

let PORT = process.env.PORT || 3000;
if (process.env.ENV === 'test') PORT = 3333;

const server = app.listen(PORT);

export default server
