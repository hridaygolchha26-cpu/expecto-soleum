
import React, { useState, useMemo, useEffect } from 'react';
import { FOOTBALL_STUDS as FOOTBALL_BOOTS } from '../data/shoes';
import { ShoeCard } from './ShoeCard';
import { calculateBootMatch, classifyFootWidth } from '../utils/fitCalculator';
import { supabase } from '../../supabase';

console.log("SHOE CATALOG FILE LOADED");
export const ShoeCatalog = ({
  userMeasurements,
  onAddToCart,
  onBuyNow,
  onBackToMeasurement,
  userId,
  favouriteIds = [],
  onToggleFavourite,
  onRequestAuth
}) => {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSort, setSelectedSort] = useState('match');
  const [searchQuery, setSearchQuery] = useState('');

  // Database catalogue state
  const [boots, setBoots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Fetch shoes from Supabase
  useEffect(() => {
    let isMounted = true;

    const fetchBoots = async () => {
    console.log('SUPABASE FETCH STARTED');
    try {
        const { data, error } = await supabase
          .from('shoes')
          .select('*')
          .order('brand', { ascending: true });

        if (error) throw error;
        console.log('SUPABASE RESPONSE:', data);
        console.log('SUPABASE ROW COUNT:', data?.length);

        const mappedBoots = (data || []).map((row) => ({
          id: row.id,
          brand: row.brand,
          name: row.name,
          edition: row.edition ?? '',
          price: Number(row.price_inr) || 0,
          surface: row.surface ?? '',
          studType: row.stud_type ?? '',
          studHeightMm: row.stud_height_mm ?? '',
          studLayout: row.stud_layout ?? '',
          soleplateTech: row.soleplate_tech ?? '',
          idealFootWidth: row.ideal_foot_width ?? '',
          widthToleranceCm: row.width_tolerance ?? { min: 0, max: 0 },
          widthProfile: row.width_profile ?? '',
          image: row.image ?? '',
          imageStuds: row.image_studs ?? '',
          fallbackImage: row.fallback_image ?? '',
          fallbackStuds: row.fallback_studs ?? '',
          studDiagram: row.stud_diagram ?? '',
          colorway: row.colorway ?? '',
          weightGrams: Number(row.weight_grams) || 0,
          upperMaterial: row.upper_material ?? '',
          description: row.description ?? '',
          fitNotes: row.fit_notes ?? '',
          proPlayers: row.pro_players ?? [],
          sizesAvailable: row.sizes_available ?? [],
          studPenetration: row.stud_penetration ?? null,
          verificationStatus: row.verification_status ?? 'unverified'
        }));

        if (!isMounted) return;

        if (mappedBoots.length > 0) {
          setBoots(mappedBoots);
          setLoadError('');
        } else {
          setBoots(FOOTBALL_BOOTS);
          setLoadError('No database records found. Showing the saved catalogue.');
        }
      } catch (error) {
        console.error('Supabase catalogue error:', error);

        if (isMounted) {
          setBoots(FOOTBALL_BOOTS);
          setLoadError('Could not connect to the live catalogue. Showing saved shoes instead.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBoots();

    return () => {
      isMounted = false;
    };
  }, []);

  const widthClassification = classifyFootWidth(
    userMeasurements.widthCm,
    userMeasurements.lengthCm
  );

  // Generate brand filters from available shoes
  const brands = useMemo(() => {
    return [
      'All',
      ...new Set(boots.map((boot) => boot.brand).filter(Boolean))
    ];
  }, [boots]);

  // Compute matches and filter
  const processedBoots = useMemo(() => {
    return boots.map((boot) => {
      const match = calculateBootMatch(boot, userMeasurements);

      return {
        ...boot,
        matchScore: match.score,
        matchStatus: match.status
      };
    })
      .filter((boot) => {
        if (selectedBrand !== 'All' && boot.brand !== selectedBrand) {
          return false;
        }

        if (
          userMeasurements.surfaceFilter &&
          userMeasurements.surfaceFilter !== 'all'
        ) {
          if (!boot.surface.includes(userMeasurements.surfaceFilter)) {
            return false;
          }
        }

        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();

          const matchesName = boot.name.toLowerCase().includes(q);
          const matchesBrand = boot.brand.toLowerCase().includes(q);
          const matchesPlayer = boot.proPlayers.some((p) =>
            p.toLowerCase().includes(q)
          );

          if (!matchesName && !matchesBrand && !matchesPlayer) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'match') return b.matchScore - a.matchScore;
        if (selectedSort === 'price-asc') return a.price - b.price;
        if (selectedSort === 'price-desc') return b.price - a.price;
        if (selectedSort === 'weight') return a.weightGrams - b.weightGrams;
        return 0;
      });
  }, [boots, userMeasurements, selectedBrand, selectedSort, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Top Banner: Biometric Calibration Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToMeasurement}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Adjust 3D measurements"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                Biometric Filter Applied
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${widthClassification.badgeColor}`}>
                {widthClassification.category}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
              Precision Boots for Your Foot Shape
            </h2>

            <p className="text-xs text-slate-400 mt-1 font-mono">
              Calibrated: <strong className="text-white">{userMeasurements.lengthCm} cm</strong> Length •
              <strong className="text-white"> {userMeasurements.widthCm} cm</strong> Width •
              <strong className="text-sky-300"> Size EU {userMeasurements.sizeEU}</strong> (UK {userMeasurements.sizeUK})
            </p>
          </div>
        </div>

        <button
          onClick={onBackToMeasurement}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-950/50 border border-sky-800/40 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-calibrate 3D Scan
        </button>
      </div>

      {/* Database Loading / Error Status */}
      {isLoading && (
        <div className="text-center py-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-sky-400 text-sm font-mono">
          Connecting to live shoe catalogue...
        </div>
      )}

      {loadError && !isLoading && (
        <div className="text-center py-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-300 text-xs">
          {loadError}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">

        {/* Brand Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="text-xs font-mono text-slate-400 uppercase mr-1">
            Brand:
          </span>

          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBrand === brand
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">

          <div className="relative flex-1 lg:w-56">
            <input
              type="text"
              placeholder="Search boot or player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400">Sort:</span>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="weight">Weight (Lightest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Results Grid */}
      {!isLoading && (
        processedBoots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedBoots.map((boot) => (
              <ShoeCard
                key={boot.id}
                boot={boot}
                userMeasurements={userMeasurements}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                isFavourite={favouriteIds.includes(boot.id)}
                onToggleFavourite={userId ? onToggleFavourite : onRequestAuth}
                onRequestAuth={onRequestAuth}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
              🔍
            </div>

            <h3 className="text-lg font-bold text-white">
              No boots match your active filter
            </h3>

            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try switching the brand filter to "All" or adjusting your search term.
            </p>

            <button
              onClick={() => {
                setSelectedBrand('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )
      )}
    </div>
  );
};
