import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography, Link as MuiLink } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { errorMessage } from "../api/client";
export function Login() {
 const { user, login } = useAuth(); const navigate = useNavigate(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 if(user) return <Navigate to="/books" replace/>;
 const submit=async(e:FormEvent)=>{e.preventDefault();setError("");setBusy(true);try{await login({email:email.trim(),password});navigate("/books",{replace:true});}catch(err){setError(errorMessage(err,"Unable to sign in"));}finally{setBusy(false);}};
 return <Container maxWidth="sm" sx={{py:8}}><Paper component="form" onSubmit={submit} sx={{p:{xs:3,sm:5},borderRadius:4}} elevation={3}><Typography variant="h4" fontWeight={800}>Welcome back</Typography><Typography color="text.secondary" sx={{mb:3}}>Sign in to your Book Management account.</Typography>{error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}<Stack spacing={2}><TextField label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/><TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/><Button type="submit" variant="contained" size="large" disabled={busy}>{busy?"Signing in…":"Sign in"}</Button></Stack><Typography sx={{mt:3}} color="text.secondary">Don't have an account? <MuiLink component={Link} to="/register">Register</MuiLink></Typography></Paper></Container>;
}
