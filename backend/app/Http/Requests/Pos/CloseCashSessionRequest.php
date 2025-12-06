<?php

declare(strict_types=1);

namespace App\Http\Requests\Pos;

use Illuminate\Foundation\Http\FormRequest;

class CloseCashSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cash_session_id' => ['required', 'integer', 'exists:cash_sessions,id'],
            'closing_amount' => ['required', 'numeric'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
