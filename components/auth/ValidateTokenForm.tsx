"use client"

import { validateTokenAction } from "@/actions/auth/validateTokenAction";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useActionState, useEffect, useState, Dispatch, SetStateAction, startTransition } from "react";
import { toast } from "react-toastify";

type ValidateTokenProps = {
    setIsValidToken: Dispatch<SetStateAction<boolean>>
    token: string
    setToken: Dispatch<SetStateAction<string>>
}

export default function ValidateTokenForm({ setIsValidToken, token, setToken }: ValidateTokenProps) {

    const [isComplete, setIsComplete] = useState(false)

    const validateTokenInput = validateTokenAction.bind(null, token)
    const [state, dispatch] = useActionState(validateTokenInput, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (isComplete) {
            startTransition(() => {
                dispatch();
            })
        }
    }, [isComplete]);

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error)
                console.error(error)
            })
        }
        if (state.success) {
            toast.success(state.success)
            setIsValidToken(true)
        }
    }, [state])

    const handleChange = (token: string) => {
        setIsComplete(false)
        setToken(token)
    }

    const handleComplete = () => {
        setIsComplete(true)
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-96">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center space-y-6 border-2 border-gray-200">
                    <p className="text-gray-600 text-sm">
                        Introduce el código de 6 dígitos que te enviamos a tu correo
                    </p>
                    <div className="flex justify-center gap-3">
                        <PinInput
                            value={token}
                            onChange={handleChange}
                            onComplete={handleComplete}
                        >
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                        </PinInput>
                    </div>
                </div>
            </div>
        </>
    )
}
