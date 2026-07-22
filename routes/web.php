<?php

use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\Dashboard\AnimalController;
use App\Http\Controllers\Dashboard\ConsultationAdminController;
use App\Http\Controllers\Dashboard\MediaUploadController;
use App\Http\Controllers\Dashboard\OfferingController;
use App\Http\Controllers\Dashboard\PageContentController;
use App\Http\Controllers\Dashboard\ReflectionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SanctuaryPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SanctuaryPageController::class, 'home'])->name('home');
Route::get('/offerings', [SanctuaryPageController::class, 'offerings'])->name('offerings');
Route::get('/the-animals', [SanctuaryPageController::class, 'animals'])->name('animals');
Route::get('/reflections', [SanctuaryPageController::class, 'reflections'])->name('reflections');
Route::get('/the-sophia-scrolls', [SanctuaryPageController::class, 'sophiaScrolls'])->name('sophia-scrolls');
Route::get('/consultation', [SanctuaryPageController::class, 'consultation'])->name('consultation');
Route::get('/contact', [SanctuaryPageController::class, 'contact'])->name('contact');
Route::post('/consultations', [ConsultationController::class, 'store'])->name('consultations.store');

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::get('/', [PageContentController::class, 'index'])->name('dashboard');

    Route::prefix('layout')->name('dashboard.layout.')->group(function () {
        Route::get('/{section}', function (string $section) {
            return app(PageContentController::class)->edit('layout', $section);
        })->whereIn('section', ['header', 'footer'])->name('edit');

        Route::put('/{section}', function (\Illuminate\Http\Request $request, string $section) {
            return app(PageContentController::class)->update($request, 'layout', $section);
        })->whereIn('section', ['header', 'footer'])->name('update');
    });

    Route::prefix('pages')->name('dashboard.pages.')->group(function () {
        Route::get('/{page}/{section}', [PageContentController::class, 'edit'])->name('edit');
        Route::put('/{page}/{section}', [PageContentController::class, 'update'])->name('update');
    });

    Route::resource('animals', AnimalController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('dashboard.animals');

    Route::resource('offerings', OfferingController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('dashboard.offerings');

    Route::resource('reflections', ReflectionController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('dashboard.reflections');

    Route::get('consultations', [ConsultationAdminController::class, 'index'])->name('dashboard.consultations.index');
    Route::put('consultations/{consultation}', [ConsultationAdminController::class, 'update'])->name('dashboard.consultations.update');
    Route::delete('consultations/{consultation}', [ConsultationAdminController::class, 'destroy'])->name('dashboard.consultations.destroy');

    Route::post('upload', [MediaUploadController::class, 'store'])->name('dashboard.upload');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::fallback(fn () => Inertia::render('NotFound')->toResponse(request())->setStatusCode(404));
