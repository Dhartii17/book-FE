import { useState, type FormEvent } from "react";
import { Alert, Button, Container, Paper, Stack, TextField, Typography, Link as MuiLink } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { errorMessage } from "../api/client";
export function Register() {
 const { user, register }=useAuth(); const navigate=useNavigate(); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 if(user) return <Navigate to="/books" replace/>;
 const submit=async(e:FormEvent)=>{e.preventDefault();setError("");setBusy(true);try{await register({name:name.trim(),email:email.trim(),password});navigate("/books",{replace:true});}catch(err){setError(errorMessage(err,"Unable to register"));}finally{setBusy(false);}};
 return <Container maxWidth="sm" sx={{py:8}}><Paper component="form" onSubmit={submit} sx={{p:{xs:3,sm:5},borderRadius:4}} elevation={3}><Typography variant="h4" fontWeight={800}>Create account</Typography><Typography color="text.secondary" sx={{mb:3}}>Register as a standard user. Admin access is managed separately.</Typography>{error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}<Stack spacing={2}><TextField label="Full name" value={name} onChange={e=>setName(e.target.value)} required inputProps={{maxLength:100}}/><TextField label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><TextField label="Password (minimum 8 characters)" type="password" value={password} onChange={e=>setPassword(e.target.value)} required inputProps={{minLength:8}}/><Button type="submit" variant="contained" size="large" disabled={busy}>{busy?"Creating account…":"Register"}</Button></Stack><Typography sx={{mt:3}} color="text.secondary">Already registered? <MuiLink component={Link} to="/login">Sign in</MuiLink></Typography></Paper></Container>;
}
