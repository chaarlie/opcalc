interface SimpleAlertProps {
    message: string
    status: number
}
function SimpleAlert({ message, status }: SimpleAlertProps) {
    const isResponseOk = status >= 200 && status < 300
    const classNames = `mt-3 alert d-flex alert-${
        isResponseOk ? 'success' : 'danger'
    }`
    return (
        <div className={classNames} role="alert">
            <div className="col-md-6">
                <span> {message}</span>
            </div>
        </div>
    )
}

export default SimpleAlert
