import {useState} from "react";

const CreateFrom = () => {
    const [Code_Fg, setCode_Fg] = useState('');
    const [Name_Fg, setName_Fg] = useState('');
    const [Code_Dr, setCode_Dr] = useState('');
    const [Name_Dr, setName_Dr] = useState('');
    const [Code_Wip, setCode_Wip] = useState('');
    const [Name_Wip, setName_Wip] = useState('');
    const [Remark, setRemark] = useState('');
    //For pending loading page
    const [isPending, SetIsPending] = useState(false)

    //Handle Submit form 
    const handleSubmit = (e) =>{
        e.preventDefault()
        SetIsPending(true);
        const bom = {Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Remark};
        fetch('http://localhost:3030/api/bom/create',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(bom),
        }).then((result)=>{
            console.log('New BOM Created');
            alert('New BOM Created');
            SetIsPending(false);
        }).catch((Error)=>{
            console.log(Error);
            alert('Plz Check Again !!!')
        });

    }
    return(
        <div>
            <h2>Add New BOM</h2>
            <form onSubmit={handleSubmit}>
                <label>Code_Fg</label>
                <input
                    type="text"
                    required
                    value={Code_Fg}
                    onChange={(e)=>setCode_Fg(e.target.value)}
                />
                <label>Name FG</label>
                <input
                    type="text"
                    required
                    value={Name_Fg}
                    onChange={(e)=>setName_Fg(e.target.value)}
                />
                <label>Code Dr</label>
                <input
                    type="text"
                    required
                    value={Code_Dr}
                    onChange={(e)=>setCode_Dr(e.target.value)}
                />  
                <label>Name Dr</label>
                <input
                    type="text"
                    required
                    value={Name_Dr}
                    onChange={(e)=>setName_Dr(e.target.value)}
                />
                <label>Code Wip</label>
                <input
                    type="text"
                    required
                    value={Code_Wip}
                    onChange={(e)=>setCode_Wip(e.target.value)}
                />
                <label>Name Wip</label>
                <input
                    type="text"
                    required
                    value={Name_Wip}
                    onChange={(e)=>setName_Wip(e.target.value)}
                />
                <label>Remark</label>
                <input
                    type="text"
                    required
                    value={Remark}
                    onChange={(e)=>setRemark(e.target.value)}
                />
                
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Data'}
                </button>
            </form>
        </div>
    );
};

export default CreateFrom;