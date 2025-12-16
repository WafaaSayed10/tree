import React, { useContext, useState } from 'react'
import { ModalStateContext } from '../context/ModalStateContext'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

export default function AddMemberModal({parents}) {
    const [name, setName] = useState("")
    const [parentId, setParentId] = useState("")
    const {setIsOpenModal}= useContext(ModalStateContext)
    const sendMember= async(e)=>{
        e.preventDefault()
        if(name){
            console.log("success");
            await addDoc(collection(db,"members"),{
                name,
                parentId: parentId || null,
                createdAt: Date.now()
            })
            setIsOpenModal(false)
        }
        else console.log("empty form");
    }
    return (
        <>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
                <div className='py-5 px-7 bg-green-100'>
                    <h2 className='font-bold text-[28px] mb-[30px]'>Add a new member</h2>
                    <form onSubmit={sendMember} className='flex flex-col gap-3'>
                        <label className='capitalize flex items-center justify-between gap-3'>
                            member name
                            <input type='text' name='name' value={name} onChange={(e)=>setName(e.target.value)} className='border border-gray-300 px-2 py-1 rounded-[8px]'/>
                        </label>
                        <label className='capitalize flex items-center justify-between gap-3'>
                            parent name
                            <select name="parentId" onChange={(e)=>setParentId(e.target.value)} className='border border-gray-300 px-2 py-1 rounded-[8px]'>
                                <option value="">Root</option>
                                {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </label>
                        <div className='flex gap-2'>
                            <button type='submit' className='capitalize px-3 py-1 border rounded-full bg-green-300 text-green-900 hover:bg-green-400 transition duration-300'>add</button>
                            <button onClick={()=>setIsOpenModal(false)} className='capitalize px-3 py-1 border rounded-full bg-green-300 text-green-900 hover:bg-green-400 transition duration-300'>cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
