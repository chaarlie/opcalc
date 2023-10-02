interface CurrentBalanceProps {
    balance: number
}
function CurrentBalance({ balance }: CurrentBalanceProps) {
    return (
        <div>
            {' '}
            Current balance: <span className="fw-bold"> ${balance}</span>
        </div>
    )
}

export default CurrentBalance
