<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Index', [
            'stats' => [
                [
                    'label' => 'Calls today',
                    'value' => '47',
                    'hint' => 'Across all covered funeral homes',
                    'trend' => ['label' => '12% vs yesterday', 'positive' => true],
                ],
                [
                    'label' => 'Active clients',
                    'value' => '28',
                    'hint' => 'Homes under live coverage',
                    'trend' => ['label' => '2 onboarding this week', 'positive' => true],
                ],
                [
                    'label' => 'Messages sent',
                    'value' => '132',
                    'hint' => 'Email, text, and fax combined',
                    'trend' => ['label' => '98% delivered', 'positive' => true],
                ],
                [
                    'label' => 'Avg. pickup',
                    'value' => '6s',
                    'hint' => 'First-call answer speed',
                    'trend' => ['label' => 'Steady through overnight', 'positive' => true],
                ],
            ],
            'recentCalls' => $this->sampleCalls()->take(5)->values()->all(),
            'clients' => $this->sampleClients()->take(3)->values()->all(),
            'coverageHours' => ['Night', 'Weekend', 'Holiday', 'Overflow'],
        ]);
    }

    public function calls(): Response
    {
        return Inertia::render('Dashboard/Calls', [
            'calls' => $this->sampleCallsDetailed()->all(),
        ]);
    }

    public function clients(): Response
    {
        return Inertia::render('Dashboard/Clients', [
            'clients' => $this->sampleClients()->all(),
        ]);
    }

    public function messages(): Response
    {
        return Inertia::render('Dashboard/Messages', [
            'messages' => [
                [
                    'id' => 'm1',
                    'funeralHome' => 'Rio Grande Funeral Home',
                    'subject' => 'First call summary for family intake',
                    'channel' => 'Email',
                    'status' => 'Sent',
                    'time' => '4 minutes ago',
                ],
                [
                    'id' => 'm2',
                    'funeralHome' => 'Sunrise Memorial Chapel',
                    'subject' => 'Urgent after-hours notification',
                    'channel' => 'Text',
                    'status' => 'Sent',
                    'time' => '18 minutes ago',
                ],
                [
                    'id' => 'm3',
                    'funeralHome' => 'Legacy Care Funeral Services',
                    'subject' => 'Verified call details attached',
                    'channel' => 'Fax',
                    'status' => 'Queued',
                    'time' => '41 minutes ago',
                ],
                [
                    'id' => 'm4',
                    'funeralHome' => 'Desert View Mortuary',
                    'subject' => 'Weekend coverage digest',
                    'channel' => 'Email',
                    'status' => 'Sent',
                    'time' => '2 hours ago',
                ],
                [
                    'id' => 'm5',
                    'funeralHome' => 'Heritage Family Funerals',
                    'subject' => 'Escalation acknowledgment',
                    'channel' => 'Text',
                    'status' => 'Failed',
                    'time' => '3 hours ago',
                ],
            ],
        ]);
    }

    public function settings(): Response
    {
        return Inertia::render('Dashboard/Settings');
    }

    private function sampleCalls()
    {
        return collect([
            [
                'id' => 'c1',
                'funeralHome' => 'Rio Grande Funeral Home',
                'caller' => 'Maria Alvarez',
                'type' => 'First call',
                'status' => 'Delivered',
                'time' => '4 min ago',
            ],
            [
                'id' => 'c2',
                'funeralHome' => 'Sunrise Memorial Chapel',
                'caller' => 'David Chen',
                'type' => 'After hours',
                'status' => 'In progress',
                'time' => '12 min ago',
            ],
            [
                'id' => 'c3',
                'funeralHome' => 'Legacy Care Funeral Services',
                'caller' => 'Patricia Moore',
                'type' => 'Verification',
                'status' => 'Verified',
                'time' => '27 min ago',
            ],
            [
                'id' => 'c4',
                'funeralHome' => 'Desert View Mortuary',
                'caller' => 'James Ortega',
                'type' => 'Overflow',
                'status' => 'Delivered',
                'time' => '49 min ago',
            ],
            [
                'id' => 'c5',
                'funeralHome' => 'Heritage Family Funerals',
                'caller' => 'Angela Brooks',
                'type' => 'First call',
                'status' => 'Delivered',
                'time' => '1 hr ago',
            ],
        ]);
    }

    private function sampleCallsDetailed()
    {
        return $this->sampleCalls()->map(function (array $call, int $index) {
            $channels = ['Phone + Email', 'Phone + Text', 'Phone + Fax', 'Phone + Portal', 'Phone + Email'];

            return [
                ...$call,
                'channel' => $channels[$index] ?? 'Phone + Email',
            ];
        });
    }

    private function sampleClients()
    {
        return collect([
            [
                'name' => 'Rio Grande Funeral Home',
                'location' => 'Albuquerque, NM',
                'coverage' => 'Nights · Weekends · Holidays',
                'status' => 'Active',
                'contacts' => 'Primary contact: Elena Ruiz',
            ],
            [
                'name' => 'Sunrise Memorial Chapel',
                'location' => 'Santa Fe, NM',
                'coverage' => '24 / 7 / 365 full coverage',
                'status' => 'Active',
                'contacts' => 'Primary contact: Mark Ellison',
            ],
            [
                'name' => 'Legacy Care Funeral Services',
                'location' => 'Las Cruces, NM',
                'coverage' => 'Overflow · After hours',
                'status' => 'Onboarding',
                'contacts' => 'Primary contact: Sofia Rivera',
            ],
            [
                'name' => 'Desert View Mortuary',
                'location' => 'Rio Rancho, NM',
                'coverage' => 'Weekends · Holidays',
                'status' => 'Active',
                'contacts' => 'Primary contact: Noah Patel',
            ],
            [
                'name' => 'Heritage Family Funerals',
                'location' => 'Farmington, NM',
                'coverage' => '24 / 7 / 365 full coverage',
                'status' => 'Active',
                'contacts' => 'Primary contact: Claire Nguyen',
            ],
            [
                'name' => 'Valley Peace Chapel',
                'location' => 'Roswell, NM',
                'coverage' => 'Nights · Overflow',
                'status' => 'Onboarding',
                'contacts' => 'Primary contact: Henry Brooks',
            ],
        ]);
    }
}
