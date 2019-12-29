const logger = require('./logging')

const requestLogger = (req, res, next)=>{
    logger.info('Method: ', req.method)
    logger.info('Path: ' ,req.path)
    logger.info('Body: ', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next)=>{
    logger.error(error.message)
    if(error.name === 'CastError' && error.kind === 'ObjectId'){
        return response.status(400).send({ error: 'malformatted id' })
    }
    if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    if(error.name==='JsonWebTokenError'){
        return response.status(401).json({'error':'invalid token'})
    }
    next(error)
}




module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
}
