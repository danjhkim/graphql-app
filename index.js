const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Listening port ${PORT}`);
});

app.get('*', (req, res) => {
	res.send({ hi: 'there' });
});
