import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const errorMap = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "Senha muito fraca. Use pelo menos 6 caracteres.",
    "auth/user-not-found": "E-mail não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde e tente novamente.",
  };

  async function handleSubmit() {
    setError(""); setSuccess("");
    if (mode === "reset") {
      if (!email) { setError("Informe seu e-mail."); return; }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccess("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
      } catch(e) { setError(errorMap[e.code] || "Erro ao enviar e-mail."); }
      finally { setLoading(false); }
      return;
    }
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    if (mode === "register") {
      if (!familyName.trim()) { setError("Informe o nome da família."); return; }
      if (password !== confirm) { setError("As senhas não coincidem."); return; }
      if (password.length < 6) { setError("Senha deve ter pelo menos 6 caracteres."); return; }
    }
    setLoading(true);
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch(e) {
      setError(errorMap[e.code] || "Erro ao autenticar. Tente novamente.");
    } finally { setLoading(false); }
  }

  return (
    <div style={{minHeight:"100vh",background:"#f8f7f4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",fontFamily:"'Instrument Sans','DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .af{background:#fff;border:1.5px solid #e7e5e4;color:#1c1917;padding:13px 16px;border-radius:12px;font-size:15px;width:100%;outline:none;transition:border-color .15s;font-family:'Instrument Sans',sans-serif;}
        .af:focus{border-color:#2563eb;}
        .ab{width:100%;padding:14px;border-radius:12px;border:none;background:#1c1917;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:'Instrument Sans',sans-serif;transition:background .15s;}
        .ab:hover{background:#292524;}
        .ab:disabled{opacity:.5;cursor:not-allowed;}
        .al{color:#2563eb;cursor:pointer;font-weight:600;text-decoration:underline;}
      `}</style>

      <div style={{width:"100%",maxWidth:400}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:800,color:"#1c1917",lineHeight:1}}>
            Controle de <span style={{color:"#2563eb"}}>Finanças</span>
          </div>
          <div style={{fontSize:13,color:"#a8a29e",marginTop:8}}>Organização financeira para sua família</div>
        </div>

        <div style={{background:"#fff",border:"1.5px solid #e7e5e4",borderRadius:20,padding:28,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:18,fontWeight:700,color:"#1c1917",marginBottom:20}}>
            {mode==="login"?"Entrar na conta":mode==="register"?"Criar conta":"Redefinir senha"}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {mode==="register" && (
              <input className="af" placeholder="Nome da família (ex: Família Silva)" value={familyName} onChange={e=>setFamilyName(e.target.value)} />
            )}
            <input className="af" type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
            {mode!=="reset" && (
              <input className="af" type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
            )}
            {mode==="register" && (
              <input className="af" type="password" placeholder="Confirmar senha" value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
            )}

            {error && <div style={{background:"#fff1f2",border:"1.5px solid #fecdd3",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#e11d48",fontWeight:500}}>{error}</div>}
            {success && <div style={{background:"#ecfdf5",border:"1.5px solid #a7f3d0",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#059669",fontWeight:500}}>{success}</div>}

            <button className="ab" onClick={handleSubmit} disabled={loading}>
              {loading?"Aguarde...":mode==="login"?"Entrar":mode==="register"?"Criar conta":"Enviar e-mail"}
            </button>
          </div>

          <div style={{textAlign:"center",fontSize:13,color:"#78716c",marginTop:18,display:"flex",flexDirection:"column",gap:8}}>
            {mode==="login" && (<>
              <span>Não tem conta? <span className="al" onClick={()=>{setMode("register");setError("");setSuccess("");}}>Criar agora</span></span>
              <span><span className="al" onClick={()=>{setMode("reset");setError("");setSuccess("");}}>Esqueci minha senha</span></span>
            </>)}
            {mode==="register" && (
              <span>Já tem conta? <span className="al" onClick={()=>{setMode("login");setError("");setSuccess("");}}>Entrar</span></span>
            )}
            {mode==="reset" && (
              <span><span className="al" onClick={()=>{setMode("login");setError("");setSuccess("");}}>← Voltar ao login</span></span>
            )}
          </div>
        </div>

        <div style={{textAlign:"center",fontSize:11,color:"#d6d3d1",marginTop:24}}>
          Seus dados são privados e seguros 🔒
        </div>
      </div>
    </div>
  );
}
