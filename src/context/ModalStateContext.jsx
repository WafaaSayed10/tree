import { createContext, useState } from "react";

export const ModalStateContext= createContext(null)

export function ModalProvider({children}){
    const [isOpenModal, setIsOpenModal] = useState(false)
    return(
        <ModalStateContext.Provider value={{isOpenModal, setIsOpenModal}}>
            {children}
        </ModalStateContext.Provider>
    )
}