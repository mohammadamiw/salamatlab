import { useState, useEffect } from 'react';
import type { Doctor } from '@/data/featuredDoctors';

export type DoctorsSource = {
	/** Direct file path under /public, e.g. "/doctors/urology.json" */
	file?: string;
	/** Category slug to resolve as "/doctors/<slug>.json" */
	categorySlug?: string;
	/** Fetch all doctors from all specialties */
	all?: boolean;
	/** Selected specialty category name (e.g., "عمومی", "زنان و زایمان") */
	selectedSpecialty?: string;
};

export const useDoctors = (source?: DoctorsSource) => {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				setLoading(true);
				setError(null);

				// If all is true, fetch from all specialty files
				if (source?.all) {
					const allDoctors: Doctor[] = [];
					
					// First get the index to know what files exist
					const indexResponse = await fetch('/doctors/index.json');
					if (!indexResponse.ok) throw new Error('خطا در دریافت نمایه تخصص‌ها');
					const indexData = await indexResponse.json();
					
					// Fetch from each specialty file
					for (const category of indexData.categories) {
						try {
							const response = await fetch(`/doctors/${category.file}`);
							if (response.ok) {
								const data = await response.json();
								if (data.doctors && Array.isArray(data.doctors)) {
									// Add category information to each doctor
									const doctorsWithCategory = data.doctors.map((doctor: Doctor) => ({
										...doctor,
										category: category.name
									}));
									allDoctors.push(...doctorsWithCategory);
								}
							}
						} catch (err) {
							console.warn(`خطا در دریافت پزشکان از ${category.file}:`, err);
							// Continue with other files
						}
					}
					
					setDoctors(allDoctors);
				} else if (source?.selectedSpecialty) {
					// Fetch doctors based on selected specialty
					const indexResponse = await fetch('/doctors/index.json');
					if (!indexResponse.ok) throw new Error('خطا در دریافت نمایه تخصص‌ها');
					const indexData = await indexResponse.json();
					
					// Find the category that matches the selected specialty
					const category = indexData.categories.find((cat: any) => cat.name === source.selectedSpecialty);
					if (category) {
						const response = await fetch(`/doctors/${category.file}`);
						if (!response.ok) throw new Error(`خطا در دریافت اطلاعات پزشکان ${source.selectedSpecialty}`);
						const data = await response.json();
						
						// Add category information to each doctor
						const doctorsWithCategory = (data.doctors || []).map((doctor: Doctor) => ({
							...doctor,
							category: category.name
						}));
						setDoctors(doctorsWithCategory);
					} else {
						throw new Error(`تخصص '${source.selectedSpecialty}' یافت نشد`);
					}
				} else {
					// Resolve target file: default to general.json
					const targetFile = (() => {
						if (source?.file) return source.file;
						if (source?.categorySlug) return `/doctors/${source.categorySlug}.json`;
						return '/doctors/general.json';
					})();

					const response = await fetch(targetFile);
					if (!response.ok) throw new Error('خطا در دریافت اطلاعات پزشکان');
					const data = await response.json();
					setDoctors((data.doctors || []) as Doctor[]);
				}
			} catch (err) {
				console.error('خطا در دریافت لیست پزشکان:', err);
				setError(err instanceof Error ? err.message : 'خطای نامشخص');
				setDoctors([]);
			} finally {
				setLoading(false);
			}
		};

		fetchDoctors();
	// Re-fetch when the source changes
	}, [source?.file, source?.categorySlug, source?.all, source?.selectedSpecialty]);

	return { doctors, loading, error };
};