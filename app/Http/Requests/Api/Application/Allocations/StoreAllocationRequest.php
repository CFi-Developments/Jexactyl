<?php

namespace Everest\Http\Requests\Api\Application\Allocations;

use Everest\Http\Requests\Api\Application\ApplicationApiRequest;

class StoreAllocationRequest extends ApplicationApiRequest
{
    public function rules(): array
    {
        return [
            'ip' => 'required|string',
            'alias' => 'sometimes|nullable|string|max:191',
            'start_port' => 'required|int|min:1024',
            'end_port' => 'sometimes|nullable|int|max:65535',
        ];
    }
}
