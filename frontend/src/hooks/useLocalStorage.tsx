import { useState, useEffect } from 'react'

const useLocalStorage = (key: string, defaultValue: any = null) => {
    const [itemInLocal, setItemInLocal] = useState(() => {
        let currentValue

        try {
            currentValue = JSON.parse(
                localStorage.getItem(key) || String(defaultValue),
            )
        } catch (error) {
            currentValue = defaultValue
        }

        return currentValue
    })

    const clearItemInLocal = () => {
        localStorage.removeItem(key)
    }

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(itemInLocal))
    }, [itemInLocal, key])

    return [itemInLocal, setItemInLocal, clearItemInLocal]
}

export default useLocalStorage
