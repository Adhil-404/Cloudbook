const Order = require("../Schema/OrderSchema");



export const placeOrder = async (req, res) => {
    try {
        const { items, totalAmount, itemCount, orderDate } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = new Order({ items, totalAmount, itemCount, orderDate });
        await order.save();



        res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to place order' });
    }
};


module.exports = { placeOrder };
