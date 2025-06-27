import React from 'react';
import { GraduationCap, ExternalLink } from 'lucide-react';

const SecurityCourses = () => {
  const courses = [
    {
      title: "CS50's Introduction to Cybersecurity",
      provider: "Harvard University",
      level: "Beginner",
      duration: "12 weeks",
      description: "Learn the fundamentals of cybersecurity, including cryptography, network security, and web security principles.",
      link: "https://www.edx.org/learn/cybersecurity/harvard-university-cs50-s-introduction-to-cybersecurity",
      image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg"
    },
    {
      title: "Applied Cryptography",
      provider: "Stanford Online",
      level: "Intermediate",
      duration: "8 weeks",
      description: "Deep dive into modern cryptography, including symmetric and public-key cryptography, digital signatures, and blockchain technology.",
      link: "https://online.stanford.edu/courses",
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
    },
    {
      title: "Network Security & Ethical Hacking",
      provider: "MIT Professional Education",
      level: "Advanced",
      duration: "10 weeks",
      description: "Master advanced network security concepts, penetration testing methodologies, and ethical hacking techniques.",
      link: "https://professional.mit.edu/",
      image: "https://images.pexels.com/photos/5380659/pexels-photo-5380659.jpeg"
    },
    {
      title: "Cloud Security Fundamentals",
      provider: "Google Cloud",
      level: "Intermediate",
      duration: "6 weeks",
      description: "Learn to secure cloud infrastructure, implement security controls, and manage cloud security policies.",
      link: "https://cloud.google.com/training",
      image: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg"
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <GraduationCap className="w-8 h-8 text-green-400" />
        <h2 className="text-3xl font-bold">Cybersecurity Courses</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course, index) => (
          <a
            key={index}
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-green-500 transition"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                  {course.level}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold group-hover:text-green-400 transition">
                  {course.title}
                </h3>
                <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-gray-400 mb-4">{course.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{course.provider}</span>
                <span>{course.duration}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SecurityCourses;