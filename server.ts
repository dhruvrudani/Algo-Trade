/**
 * @author MitcodeMode
 */

import server from './src';
const port = process.env.PORT || 6699;
server.listen(port, () => {
    console.log(`server started on port ${port}`);
});