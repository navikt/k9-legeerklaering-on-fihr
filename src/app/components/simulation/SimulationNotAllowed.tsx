const SimulationNotAllowed = () => {
    const errorStyle = {"color": "var(--a-text-danger)"}
    return (
        <div className="mx-auto mt-16 max-w-4xl p-4 pb-32 ">
            <h2 style={errorStyle}>Not allowed</h2>
            <p>This deployment does not allow simulation of backends. This page is only meant to be used during development/testing.</p>
            <p>
                <a href="/">Back to start page.</a>
            </p>
        </div>
    )
}

export default SimulationNotAllowed;
