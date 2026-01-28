<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Aceptar 'login' (usuario o email) o 'email' para compatibilidad
        $loginField = $request->input('login') ?? $request->input('email');
        $password = $request->input('password');

        // Validar que tenemos los campos necesarios
        if (empty($loginField) || empty($password)) {
            return response()->json(['message' => 'Por favor, ingresa usuario/email y contraseña'], 422);
        }

        // Determinar si es email o nombre de usuario
        $isEmail = filter_var($loginField, FILTER_VALIDATE_EMAIL);

        // Buscar usuario por email o por username
        $user = \App\Models\User::where($isEmail ? 'email' : 'username', $loginField)->first();

        if (!$user || !\Illuminate\Support\Facades\Hash::check($password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        // Autenticar manualmente al usuario
        Auth::login($user);

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => ['id' => $user->id, 'username' => $user->username, 'name' => $user->name, 'surname' => $user->surname, 'dni' => $user->dni, 'email' => $user->email, 'role' => $user->role],
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:50', 'unique:users', 'regex:/^[a-zA-Z0-9_]+$/'],
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['nullable', 'string', 'max:255'],
            'dni' => ['nullable', 'string', 'max:20', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = \App\Models\User::create([
            'username' => $data['username'],
            'name' => $data['name'],
            'surname' => $data['surname'] ?? null,
            'dni' => $data['dni'] ?? null,
            'email' => $data['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
            'role' => 'user', // Todos los nuevos usuarios tienen rol 'user' por defecto
        ]);

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => ['id' => $user->id, 'username' => $user->username, 'name' => $user->name, 'surname' => $user->surname, 'dni' => $user->dni, 'email' => $user->email, 'role' => $user->role],
        ], 201);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'OK']);
    }
}
