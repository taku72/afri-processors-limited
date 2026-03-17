import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MapPin, Briefcase, Clock, Users, Building, GraduationCap, ArrowRight, Send } from 'lucide-react'

export default function Careers() {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Production Manager",
      department: "Operations",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "8+ years",
      description: "Lead our production team and oversee all manufacturing operations to ensure quality and efficiency...",
      requirements: [
        "Bachelor's degree in Engineering or related field",
        "8+ years of experience in food processing",
        "Strong leadership and management skills",
        "Knowledge of food safety standards"
      ]
    },
    {
      id: 2,
      title: "Quality Control Analyst",
      department: "Quality Assurance",
      location: "Abuja, Nigeria",
      type: "Full-time",
      experience: "3-5 years",
      description: "Ensure product quality through rigorous testing and analysis of raw materials and finished goods...",
      requirements: [
        "Bachelor's degree in Food Science or Chemistry",
        "3+ years of experience in quality control",
        "Knowledge of HACCP and ISO standards",
        "Attention to detail and analytical skills"
      ]
    },
    {
      id: 3,
      title: "Sales Executive",
      department: "Sales & Marketing",
      location: "Port Harcourt, Nigeria",
      type: "Full-time",
      experience: "2-4 years",
      description: "Drive sales growth and build strong relationships with clients across Nigeria...",
      requirements: [
        "Bachelor's degree in Business or Marketing",
        "2+ years of sales experience",
        "Excellent communication and negotiation skills",
        "Ability to meet sales targets"
      ]
    },
    {
      id: 4,
      title: "Maintenance Engineer",
      department: "Engineering",
      location: "Kano, Nigeria",
      type: "Full-time",
      experience: "5+ years",
      description: "Maintain and repair all processing equipment to ensure optimal performance...",
      requirements: [
        "Bachelor's degree in Mechanical Engineering",
        "5+ years of maintenance experience",
        "Knowledge of industrial equipment",
        "Problem-solving skills"
      ]
    }
  ]

  const benefits = [
    {
      icon: Users,
      title: "Professional Development",
      description: "Continuous learning opportunities and career advancement"
    },
    {
      icon: Building,
      title: "Modern Facilities",
      description: "State-of-the-art work environment with latest technology"
    },
    {
      icon: GraduationCap,
      title: "Training Programs",
      description: "Comprehensive training and skill development programs"
    },
    {
      icon: Briefcase,
      title: "Career Growth",
      description: "Clear career path with opportunities for advancement"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Team
          </h1>
          <p className="text-lg text-primary-100">
            Build a rewarding career with Afri Processors and contribute to Africa's agricultural growth
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join Afri Processors?
            </h2>
            <p className="text-xl text-gray-600">
              We offer more than just a job - we offer a career with purpose
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Openings
            </h2>
            <p className="text-xl text-gray-600">
              Explore opportunities to join our growing team
            </p>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Briefcase size={16} className="mr-1" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Apply Now
                  </button>
                  <button className="border border-primary-600 text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Culture & Values
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At Afri Processors, we foster a culture of innovation, integrity, and excellence. We believe in empowering our employees to grow both personally and professionally while making a meaningful impact on Africa's agricultural sector.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our values guide everything we do - from how we treat our employees and customers to how we operate our facilities and engage with our communities.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Commitment to quality and excellence</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Innovation and continuous improvement</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Sustainability and environmental responsibility</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Employee welfare and development</span>
                </li>
              </ul>
              <Link 
                href="/about" 
                className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
              >
                Learn More About Our Company
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="mx-auto mb-4" size={64} />
                <p>Team Culture Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-gray-600">
              Send us your resume and we'll keep you in mind for future opportunities
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department of Interest
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Select department</option>
                    <option>Operations</option>
                    <option>Sales & Marketing</option>
                    <option>Quality Assurance</option>
                    <option>Engineering</option>
                    <option>Finance</option>
                    <option>Human Resources</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter / Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us why you'd like to join Afri Processors..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" className="hidden" />
                  <p className="text-gray-600">Drop your resume here or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Send className="mr-2" size={20} />
                Send Application
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
