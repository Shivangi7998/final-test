export default function errorMiddleware (err, req, res, next){
    console.error (err);
    const status = err.statuscode || 500;
    res.status (status).json({
        ok: false,
        errpr: err.message || 'server error'

    });
}