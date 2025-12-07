<?php

declare(strict_types=1);

namespace App\Services\Promotions;

use App\Models\Promotion;
use App\Models\PromotionLog;
use Carbon\Carbon;
use Illuminate\Database\DatabaseManager;

class PromotionService
{
    public function __construct(private readonly DatabaseManager $db)
    {
    }

    public function createPromotion(array $data, string $userId): Promotion
    {
        return $this->db->transaction(function () use ($data, $userId) {
            $promotion = Promotion::create([
                ...$data,
                'discount_type' => Promotion::DISCOUNT_PERCENTAGE,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            $this->recordLog($promotion, PromotionLog::EVENT_CREATED, $userId, $data);

            if ($promotion->is_active) {
                $this->recordLog($promotion, PromotionLog::EVENT_ACTIVATED, $userId);
            }

            return $promotion->fresh();
        });
    }

    public function updatePromotion(Promotion $promotion, array $data, string $userId): Promotion
    {
        return $this->db->transaction(function () use ($promotion, $data, $userId) {
            $promotion->fill($data);
            $promotion->updated_by = $userId;
            $promotion->save();

            $this->recordLog($promotion, PromotionLog::EVENT_UPDATED, $userId, $data);

            return $promotion->fresh();
        });
    }

    public function togglePromotion(Promotion $promotion, string $userId): Promotion
    {
        return $this->db->transaction(function () use ($promotion, $userId) {
            $promotion->is_active = !$promotion->is_active;
            $promotion->updated_by = $userId;
            $promotion->save();

            $event = $promotion->is_active ? PromotionLog::EVENT_ACTIVATED : PromotionLog::EVENT_DEACTIVATED;
            $this->recordLog($promotion, $event, $userId);

            return $promotion->fresh();
        });
    }

    public function deletePromotion(Promotion $promotion, string $userId): void
    {
        $this->db->transaction(function () use ($promotion, $userId) {
            $promotion->updated_by = $userId;
            $promotion->save();

            $promotion->delete();

            $this->recordLog($promotion, PromotionLog::EVENT_DELETED, $userId);
        });
    }

    private function recordLog(Promotion $promotion, string $event, string $userId, array $payload = []): void
    {
        $promotion->logs()->create([
            'event_type' => $event,
            'event_at' => Carbon::now(),
            'user_id' => $userId,
            'payload' => $payload ?: null,
        ]);
    }
}
