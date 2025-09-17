import { useEffect } from 'react';

interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  specialty?: string;
  address?: string;
  phone?: string;
  url?: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  name = "آزمایشگاه تشخیص پزشکی سلامت",
  description = "آزمایشگاه تشخیص پزشکی سلامت پیشرو در ارائه خدمات تشخیص پزشکی با بالاترین کیفیت در شهرقدس",
  specialty,
  address = "شهرقدس، میدان مصلی",
  phone = "+98-21-46833010",
  url
}) => {
  useEffect(() => {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "name": name,
      "description": description,
      "url": url || window.location.origin,
      "telephone": phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address,
        "addressLocality": "شهرقدس",
        "addressRegion": "تهران", 
        "postalCode": "3751",
        "addressCountry": "IR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "35.7219",
        "longitude": "51.1157"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
          "opens": "06:30",
          "closes": "20:30"
        },
        {
          "@type": "OpeningHoursSpecification", 
          "dayOfWeek": "Thursday",
          "opens": "06:30",
          "closes": "19:30"
        }
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": phone,
          "contactType": "customer service",
          "areaServed": "IR",
          "availableLanguage": ["fa", "Persian"]
        }
      ],
      "sameAs": [
        "https://www.instagram.com/salamatlab"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "خدمات آزمایشگاهی و پزشکی",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "آزمایش‌های تشخیص پزشکی"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "مشاوره پزشکی تخصصی"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "نمونه‌گیری در منزل"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // Add specialty if provided
    if (specialty) {
      localBusinessSchema.medicalSpecialty = specialty;
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(localBusinessSchema);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [name, description, specialty, address, phone, url]);

  return null;
};

export default LocalBusinessSchema;
