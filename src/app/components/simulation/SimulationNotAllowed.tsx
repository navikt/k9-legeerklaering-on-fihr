const SimulationNotAllowed = () => {
    return (
        <>
            <h2>Not allowed</h2>
            <p>This deployment does not allow simulation of backends. This page is only meant to be used during development/testing.</p>
            <p>
                <a href="/">Back to start page.</a>
            </p>
        </>
    )
}

export default SimulationNotAllowed;
